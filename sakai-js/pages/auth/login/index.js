import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import Global from '../../api/Global';
import {Link, useNavigate} from 'react-router-dom';

const LoginPage = () => {
    
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState("");
    const [checked, setChecked] = useState(false);
    const {layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const [validationErrors, setValidationErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    
    useEffect(()=>{
        if(localStorage.getItem('usuario') != "" && localStorage.getItem('usuario') != null && localStorage.getItem('usuario') != undefined){
            router.push('/');
            
        }
        else{
            router.push('/auth/login');
        }
        
    }, [])

    const LoginAction  = (e) =>{
        setValidationErrors({});
        e.preventDefault();
        setIsSubmitting(true);
        let parameter = {
            // variable del endpoint : variable const
            usua_Usuario: email,
            usua_Clave: password,
        };
        // ENDPOINT A LA API
        axios.post(Global.url + 'Usuarios/Login', parameter)
        .then((item) => {
            setIsSubmitting(false)
            var id = item.data.data.pers_Id;
            var msj = item.data.message;
            localStorage.setItem('usuario', id);
            router.push('/');
        })
        .catch((ex)=>{ setIsSubmitting(false)
            if (ex.response.data.errors != undefined) {
                setValidationErrors(ex.response.data.errors);
            }
            if (ex.response.data.error != undefined) {
                setValidationErrors(ex.response.data.error);
            }
        });
    }

    const validateForm = () => {
        const errors = {};
        if (!email) {
          errors.email = 'Usuario es requerido.';
        }
        if (!password) {
          errors.password = 'Contraseña es requerida.';
        }
        return errors;
      };
      
      const handleSubmit = (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            setValidationErrors({});
            setIsSubmitting(true);
            let parameter = {
              usua_Usuario: email,
              usua_Clave: password,
            };
            axios.post(Global.url + 'Usuarios/Login', parameter)
              .then((item) => {
                var code = item.data.code;
                if(code == 500)
                {
                    setErrorMessage("Usuario o Contraseña incorrectos");
                }
                if(code != 500)
                {
                    setErrorMessage(null);
                }
                if(code == 200)
                {
                setIsSubmitting(false);
                setErrorMessage(null);
                var id = item.data.data.pers_Id;
                var msj = item.data.message;
                localStorage.setItem('usuario', id);
                router.push('/');
                }
                
              })
              .catch((ex) => {
                setIsSubmitting(false)
                if (ex.response && ex.response.data && ex.response.data.errors != undefined) {
                  setValidationErrors(ex.response.data.errors);
                }
                if (ex.response && ex.response.data && ex.response.data.error != undefined) {
                  setValidationErrors(ex.response.data.error);
                }
              });              
        } else {
          setValidationErrors(errors);
        }
      };
      

    return (
          

        <div className={containerClassName}>
           
           <div className="flex flex-column align-items-center justify-content-center" style={{ textAlign: 'center' }}>
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">¡Bienvenido!</div>
                            <span className="text-600 font-medium">Inicia Sesión para continuar</span>
                        </div>
                    
<div>
<div className="mb-5">
{errorMessage && (
    <div className="text-red-600 font-bold mb-2">{errorMessage}</div>
  )}
  <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
    Usuario
  </label>
  <InputText
    inputid="email1"
    type="text"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Usuario"
    className="w-full md:w-30rem mb-5"
    style={{ padding: '1rem' }}
  />
  {validationErrors.email && (
   <span style={{ fontWeight: 'bold', textAlign: 'center' }}><div className="text-red-600" >{validationErrors.email}</div></span>
  )}
  </div>

<div className="mb-5">
  <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
    Contraseña
  </label>
  <InputText
    type='password'
    inputid="password1"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Contraseña"
    toggleMask
    className="w-full mb-5"
    inputClassName="w-full p-3 md:w-30rem"
  />
  {validationErrors.password && (
    <span style={{fontWeight: 'bold', textAlign: 'center' }}><div className="text-red-600" >{validationErrors.password}</div></span>
  )}
  </div>

  <Button
    type="submit"
    label="Iniciar Sesión"
    onClick={handleSubmit}
    className="w-full p-3 text-xl"
  ></Button>
</div>

                    </div>
                </div>
            </div>
          
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );

};
export default LoginPage;
