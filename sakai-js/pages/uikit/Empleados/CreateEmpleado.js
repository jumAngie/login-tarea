import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import Select from "react-select";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { CountryService } from "../../../demo/service/CountryService";
import Global from "../../api/Global";

const CreateEmpleado = () => {
    
  //Se asigna los datos al dropDown

  const [estadosCiviles, setEstadosCiviles] = useState([]);
  const [estadoCivilSeleccionado, setEstadoCivilSeleccionado] = useState(null);

  const [cargoOptions, setCargoOptions] = useState([]);
  const [selectedCargo, setSelectedCargo] = useState(null);

  const [sucursalOptions, setSucursalOptions] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState(null);

  const [radioValue, setRadioValue] = useState(null);

  /////
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    //Sucursal DDL
    fetch(Global.url + "Sucursal/List")
      .then((response) => response.json())
      .then((data) =>
        setSucursalOptions(
          data.map((s) => ({ value: s.sucu_Id, label: s.sucu_Nombre }))
        )
      )
      .catch((error) => console.error(error));

    //Estado Cuvil DDL
    fetch(Global.url + "EstadoCivil/List")
      .then((response) => response.json())
      .then((data) =>
        setEstadosCiviles(
          data.map((e) => ({
            value: e.estc_Id,
            label: e.estc_Descripcion,
          }))
        )
      )
      .catch((error) => console.error(error));

    //Cargo DDL
    fetch(Global.url + "Cargo/List")
      .then((response) => response.json())
      .then((data) =>
        setCargoOptions(
          data.map((c) => ({ value: c.carg_Id, label: c.carg_Cargo }))
        )
      )
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="card">
      <h5>Nuevo Empleado</h5>
      <form className="mid-form">
        <div className="grid p-fluid">
          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="DNI">DNI</label>
              <InputNumber id="inputnumber" className="p-valid" />
            </div>

            <div className="field mt-3">
              <label htmlFor="Apellido">Apellido</label>
              <InputText type="text" id="Apellido" className="p-valid" />
            </div>

            <div className="field">
              <label htmlFor="estadoCivil">Estado Civil</label>
              <Select
                value={estadoCivilSeleccionado}
                onChange={(e) => setEstadoCivilSeleccionado(e)}
                options={estadosCiviles}
                placeholder="Seleccionar"
              />
            </div>

            <div className="field">
              <label htmlFor="sucursal">Sucursal</label>
              <Select
                value={selectedSucursal}
                onChange={(e) => setSelectedSucursal(e)}
                options={sucursalOptions}
                placeholder="Seleccionar"
              />
            </div>
          </div>

          <div className="col-12 md:col-6">
            <div className="field">
              <label htmlFor="Nombre">Nombre</label>
              <InputText type="text" id="Nombre" className="p-valid" />
            </div>
            <div className="field mt-3">
              <label htmlFor="Sexo">Sexo</label>
              <div className="grid">
                <div className="col-12 md:col-4">
                  <div className="field-radiobutton">
                    <RadioButton
                      inputId="option1"
                      name="option"
                      value="M"
                      checked={radioValue === "M"}
                      onChange={(e) => setRadioValue(e.value)}
                    />
                    <label htmlFor="option1">Masculino</label>
                  </div>
                </div>
                <div className="col-12 md:col-4">
                  <div className="field-radiobutton">
                    <RadioButton
                      inputId="option2"
                      name="option"
                      value="Los F"
                      checked={radioValue === "F"}
                      onChange={(e) => setRadioValue(e.value)}
                    />
                    <label htmlFor="option2">Femenino</label>
                  </div>
                </div>
              </div>

              <div className="field">
                <label htmlFor="cargo">Cargo</label>
                <Select
                  value={selectedCargo}
                  onChange={(e) => setSelectedCargo(e)}
                  options={cargoOptions}
                  placeholder="Seleccionar"
                />
              </div>

            </div>
          </div>
        </div>

        <Button label="Success" severity="success" />
      </form>
    </div>
  );
};

export default CreateEmpleado;
