import "../../App.css";
import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"
import Avatar from './Avatar'
import PublicRouters from "../../routers/PublicRouters"
import Navbar from "../Navbar"

//FORMIK
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";

//OBTENER VALORES
const Account = ({ session }) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [role, setRole] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [email, setEmail] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        getProfile()
    }, [session])

    const formik = useFormik({
        initialValues: {
            username: '',
            role: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.username) {
                errors.name = 'El nombre es requerido.';
            }

            if (!data.role) {
                errors.role = 'El rol es requerido.';
            }
            return errors;
        },
        onSubmit: (data) => {
            setFormData(data);
            setShowMessage(true);

            formik.resetForm();
        },
    });
    const isFormFieldValid = (name) =>
        !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return (
            isFormFieldValid(name) && (
                <small className="p-error">{formik.errors[name]}</small>
            )
        );
    };

    const getProfile = async () => {
        try {
            setLoading(true)
            //USUARIO DE LA SESION ACTUAL
            const { data: { user } } = await supabase.auth.getUser()
            //console.log(user.id)
            //OBTENGO USUARIO CON EL ID DE LA SESION
            const { data, error } = await supabase
                .from('profiles')
                .select('username, role, avatar_url')
                .eq('id', user.id)
                .single()

            if (data === null || data.username === null) {
                setLoading(false)
            }
            // console.log(loading)
            if (data) {
                setUsername(data.username)
                setRole(data.role)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            alert(error.message)
        } finally {
            //setLoading(false)
        }

    }

    const updateProfile = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()

            const updates = {
                id: user.id,
                username,
                role,
                avatar_url,
                updated_at: new Date()
            }

            let { error } = await supabase.from("profiles")
                .upsert(updates, { returning: 'minimal' })

            if (error) {
                throw error;
            }
        } catch (error) {
            alert(error.message)
        } finally {
            //setLoading(false)
        }
    }

    return (
        <div>
            {loading ? (
                <PublicRouters />
                // <Navbar render={loading}/>
            ) : (
                <div className="hero">
                    <div className="contenido-hero">
                        <div className="form-demo">
                            <div className="flex justify-content-center">
                                <div className="card">
                                    <p
                                        className="title-form "
                                        style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: "35px" }}
                                    >
                                        Actualizar datos
                                    </p>
                                    <p className="text-m text-gray-400 pb-3" style={{ fontSize: "16px" }}>
                                        Por favor ingrese sus datos:{" "}
                                    </p>
                                    <form onSubmit={updateProfile} className="p-fluid">
                                        <div className="field">
                                            <span className="p-float-label p-input-icon-right">
                                                <i className="pi pi-user" />
                                                <InputText id="username" name="text" value={username || ''} onChange={(e) => setUsername(e.target.value)} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('username') })} />
                                                <label htmlFor="username" className={classNames({ 'p-error': isFormFieldValid('username') })}>Nombre*</label>
                                            </span>
                                            {getFormErrorMessage('username')}
                                        </div>
                                        <div className="field">
                                            <span className="p-float-label p-input-icon-right">
                                                <i className="pi pi-id-card" />
                                                <InputText id="text" name="text" value={role || ''} onChange={(e) => setRole(e.target.value)} className={classNames({ 'p-invalid': isFormFieldValid('role') })} />
                                                <label htmlFor="role" className={classNames({ 'p-error': isFormFieldValid('role') })}>Rol*</label>
                                            </span>
                                            {getFormErrorMessage('role')}
                                        </div>
                                        <div className="button-footer">
                                            <Button
                                                type="submit"
                                                label="Actualizar datos"
                                                className="mt-2"
                                                style={{ background: "#5EB319", borderColor: "#5EB319" }}
                                                disabled={loading}
                                            />
                                            <Button
                                                type="submit"
                                                label="Salir"
                                                className="mt-2"
                                                style={{ background: "#928E8D", borderColor: "#716F6F" }}
                                                onClick={() => supabase.auth.signOut()}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div >
                    </div >
                </div >
            )
            }
        </div>

    )
}

export default Account;