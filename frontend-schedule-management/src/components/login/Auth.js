import "../../App.css";
import { useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import logo from "../../assets/img/logo.png";
import { Toast } from 'primereact/toast';

//FORMIK
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";

function Auth() {
  //FORMULARIO
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  let toast = useRef(null)

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.email) {
        errors.email = "Email es requerido.";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)
      ) {
        errors.email = "Invalid email address. E.g. example@email.com";
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

  //AUTENTICACION
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      // alert("Verifica tu correo");
      toast.current.show({ severity: 'success', summary: 'Link enviado', detail: 'Verifica tu correo', life: 5000 });
    } catch (error) {
      console.log(error);
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-auth">
      <Toast ref={toast} />
      <div className="degradado">
        <div className="logo">
          <img src={logo} alt={"logo"} width="400px" />
        </div>
        <p
          className="title-form"
          style={{ color: "#000000", fontWeight: "bold", fontSize: "20px" }}
        >
          Inicia Sesión
        </p>
      </div>

      {/* <div className="col-6 form-widget" aria-live="polite"> */}
      <div className="form-demo">
        <div className="flex justify-content-center">
          <div className="card">
            <p
              className="title-form"
              style={{ color: "#000000", fontWeight: "bold", fontSize: "25px" }}
            >
              Hola, ¡Bienvenido!
            </p>
            <p className="text-s text-gray-500 pb-3">
              Inicie sesión con su correo electrónico:{" "}
            </p>
            {loading ? (
              "Enviando link para autenticación..."
            ) : (
              <form onSubmit={handleLogin} className="p-fluid">
                <div className="field">
                  <span className="p-float-label p-input-icon-right">
                    <i className="pi pi-envelope" />
                    <InputText
                      id="website"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={classNames({
                        "p-invalid": isFormFieldValid("email"),
                      })}
                    />
                    <label
                      htmlFor="email"
                      className={classNames({
                        "p-error": isFormFieldValid("email"),
                      })}
                    >
                      Correo electrónico*
                    </label>
                  </span>
                  {getFormErrorMessage("email")}
                </div>

                <Button
                  type="submit"
                  label="Iniciar sesión"
                  className="mt-2"
                  style={{ background: "#5EB319", borderColor: "#5EB319" }}
                />
              </form>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
export default Auth;
