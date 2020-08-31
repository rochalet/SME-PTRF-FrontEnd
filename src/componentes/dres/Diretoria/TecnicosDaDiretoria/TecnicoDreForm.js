import {Formik} from "formik";

import {ModalBootstrapFormMembros} from "../../../Globais/ModalBootstrap";
import React from "react";
import * as yup from "yup";

export const YupSignupSchemaTecnico = yup.object().shape({
    rf: yup.string().required("Campo RF do técnico é obrigatório"),
});


export const TecnicoDreForm = ({show, handleClose, onSubmit, handleChange, validateForm, initialValues, btnSalvarReadOnly}) => {

    const bodyTextarea = () => {
        return (
            <>
                {
                    <Formik
                        initialValues={initialValues}
                        validationSchema={YupSignupSchemaTecnico}
                        validate={validateForm}
                        enableReinitialize={true}
                        validateOnBlur={true}
                        onSubmit={onSubmit}
                    >
                        {props => {
                            const {
                                errors,
                                values,
                                setFieldValue,
                            } = props;
                            return (
                                <form method="POST" id="membrosForm" onSubmit={props.handleSubmit}>

                                    <div className="row">
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="cargo_associacao">Registro funcional</label>
                                                <input
                                                    type="text"
                                                    value={props.values.rf ? props.values.rf : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChange(e.target.name, e.target.value);
                                                    }
                                                    }
                                                    name="rf"
                                                    className="form-control"
                                                />
                                                {props.errors.rf &&
                                                <span className="span_erro text-danger mt-1"> {props.errors.rf}</span>}
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="cargo_associacao">Nome completo</label>
                                                <input
                                                    type="text"
                                                    value={props.values.nome ? props.values.nome : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChange(e.target.name, e.target.value);
                                                    }
                                                    }
                                                    name="nome"
                                                    className="form-control"
                                                    readOnly={true}
                                                />
                                                {props.errors.nome && <span
                                                    className="span_erro text-danger mt-1"> {props.errors.nome}</span>}
                                            </div>
                                        </div>


                                    </div>
                                    <div className="d-flex  justify-content-end pb-3 mt-3">
                                        <button onClick={() => handleClose()} type="button"
                                                className="btn btn btn-outline-success mt-2 mr-2">Cancelar
                                        </button>
                                        <button disabled={btnSalvarReadOnly} type="submit" className="btn btn-success mt-2">Adicionar</button>
                                    </div>
                                </form>
                            );
                        }}
                    </Formik>
                }
            </>
        )
    };
    return (
        <ModalBootstrapFormMembros
            show={show}
            onHide={handleClose}
            titulo="Adicionar novo técnico"
            bodyText={bodyTextarea()}
        />
    )
};