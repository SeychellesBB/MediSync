import React, { useEffect } from 'react'
import { Form, Formik } from 'formik'
import * as yup from "yup";
import { error_alert, hidePopup, stringNotEmpty, success_alert } from '../../../utils';
import TextField from '../../../components/FormikFields/TextField';
import TextareaField from '../../../components/FormikFields/TextareaField';
import DateField from '../../../components/FormikFields/DateField';
import { BiLoaderAlt } from 'react-icons/bi';
import { Axios } from '../../../api';
import { useContext } from 'react';
import { BasePopupContext } from '../../../components/BasePopup';
import SelectField from '../../../components/FormikFields/SelectField';
import TimeField from '../../../components/FormikFields/TimeField';
import { OTHER } from '../../../constants';



const FormContainer = ({ data, id , refreshListing,isUpdate}) => {
  const { setPopup } = useContext(BasePopupContext)


  let initialValues = {
      symptom_description: data?data.description:"",
      title: data?data.title:"",
      severity: data?{label: data.severity , value:data.severity}:"",
      duration: data? data.duration:"",
      date: data?data.date:"",
      time: data? data.time:"00:00",
      factors: data?{label: data.associated_factors , value:data.associated_factors}:"",
      factor_other: data ? data.factor_other :"",
      triger_other: data?  data.triger_other :"",

      trigger: data?{label:data.triggers, value:data.triggers}:"",
      medications_taken: data?data.medications_taken:"",
      comments: data?data.notes:"",
      // body_parts: data?{label:data.body_part, value:data.body_part}:""
      body_parts: data?data.body_part:""
  }

  yup.addMethod(yup.string, 'stringNotEmpty', stringNotEmpty)

  const validationSchema = yup.object({
      symptom_description: yup.string().required("Required"),
      title: yup.string().required("Required"),
      severity: yup.object().nullable().required("Required"),
      duration: yup.string().required("Required"),
      date: yup.string().required("Required"),
      factors: yup.object().nullable().required("Required"),
      factor_other: yup.string(),
      triger_other: yup.string(),
      medications_taken: yup.string().required("Required"),
      comments: yup.string().required("Required"),
      // body_parts: yup.object().nullable().required("Required"),
      body_parts: yup.string().required("Required"),
      trigger: yup.object().nullable().required("Required")

  })

  const handleSubmit = async (values, formikBag) => {
      
      let payload = {
          title : values.title,
          severity: values.severity.value,
          associated_factors: values.factors.value,
          // body_part:values.body_parts.value,
          body_part:values.body_parts,
          triggers:values.trigger.value,
          duration: values.duration,
          date: values.date,
          time:values.time,
          description: values.symptom_description,
          medications_taken: values.medications_taken,
          notes:values.comments,
      }
      try {
          if(isUpdate){
              let result = await Axios.put(`api/symptoms/${data.id}`, payload, { requestId: "member-update" });
          }else{
              let result = await Axios.post("api/symptoms/", payload, { requestId: "member-post" });
          }
          success_alert("Symptom added successfully")
          hidePopup(setPopup)
          refreshListing();
      } catch (e) {
          if (e.response) {
              error_alert(JSON.stringify(e.response.data.description))
          } else {
              error_alert("Network Error!")
          }
      }
  }


  const SEVERRITY_OPTIONS = [
      {
          label: "Mild",
          value: "mild"
      },
      {
          label: "Moderate",
          value: "moderate"
      },
      {
          label: "Severe",
          value: "severe"
      }

  ]
  const FACTORS_OPTIONS = [
      {
          label: "Stress",
          value: "Stress"
      },
      {
          label: "Exercise",
          value: "Exercise"
      },
      {
          label: "Diet",
          value: "Diet"
      },
      {
          label: "Reaction to medication",
          value: "Reaction to medication"
      },
      {
          label: "Current medication effects",
          value: "Current medication effects"
      },
      {value:OTHER, label:"Other"},
      {value:"Not Known", label:"Not Known"},

  ]

  const TEST_TRIGER_OPTIONS =[
      {value:"test-triger", label:"Test triger"},
      {value:"Not Known", label:"Not Known"},
      {value:OTHER, label:"Other"},
  ]


  return (
      <div>
          <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
          >
              {
                  form => (
                      <Formik
                          initialValues={initialValues}
                          validationSchema={validationSchema}
                          onSubmit={handleSubmit}
                      >
                          {
                              form => (
                                  <Form>
                                      <div className='space-y-3'>
                                          <div className="grid sm:grid-cols-3  items-center gap-5">
                                              <TextField
                                                  field={'title'}
                                                  disabled={true}
                                                  placeholder={'title'}
                                                  label_text={<span>Symptom Title<span className='text-red-500'>*</span></span>}
                                                  form={form}
                                              />

                                              <SelectField
                                                  field={'severity'}
                                                  disabled={true}
                                                  label_text={<span>Severity<span className='text-red-500'>*</span></span>}
                                                  placeholder={"Symptom's Severity "}
                                                  form={form}
                                                  options={SEVERRITY_OPTIONS}
                                              />
                                              <SelectField
                                                  field={'factors'}
                                                  disabled={true}
                                                  label_text={<span>Factors<span className='text-red-500'>*</span></span>}
                                                  placeholder={"Associated Factors"}
                                                  form={form}
                                                  options={FACTORS_OPTIONS}
                                              />
                                              {
                                                  form.values.factors&&form.values.factors.value===OTHER&&
                                                  <TextField
                                                  field={'factor_other'}
                                                  disabled={true}
                                                  placeholder={'Explain factor'}
                                                  label_text={<span>Other<span className='text-red-500'>*</span></span>}
                                                  form={form}
                                              />

                                              }
                                              {/* <SelectField
                                                  field={'body_parts'}
                                                  disabled={true}
                                                  label_text={<span>Affected Area<span className='text-red-500'>*</span></span>}
                                                  placeholder={"Affected Area"}
                                                  form={form}
                                                  options={[{value:"neck", label:"Neck"}]}
                                              /> */}
                                              <TextField
                                                  field={'body_parts'}
                                                  disabled={true}
                                                  placeholder={'Affected Area'}
                                                  label_text={<span>Affected Area<span className='text-red-500'>*</span></span>}
                                                  form={form}
                                              />
                                              <SelectField
                                                  field={'trigger'}
                                                  disabled={true}
                                                  label_text={<span>Trigger<span className='text-red-500'>*</span></span>}
                                                  placeholder={"triger"}
                                                  form={form}
                                                  options={TEST_TRIGER_OPTIONS}
                                              />
                                               {
                                                  form.values.trigger&&form.values.trigger.value===OTHER&&
                                                  <TextField
                                                  field={'triger_other'}
                                                  disabled={true}
                                                  placeholder={'Explain triger'}
                                                  label_text={<span>Other<span className='text-red-500'>*</span></span>}
                                                  form={form}
                                              />
                                               }


                                              <TextField
                                                  field={'duration'}
                                                  disabled={true}
                                                  placeholder={'eg:- 2 hours'}
                                                  label_text={<span>Duration<span className='text-red-500'>*</span></span>}
                                                  form={form}
                                              />

                                              <DateField
                                                  form={form}
                                                  field={'date'}
                                                  disabled={true}
                                                  label_text={<span>Date<span className='text-red-500'>*</span></span>}
                                              />
                                              <TimeField form={form} field={`time`} label_text={"Time"} />



                                              <div className='col-span-2'>
                                                  <TextareaField
                                                      field={'symptom_description'}
                                                      disabled={true}
                                                      label_text={<span>Description<span className='text-red-500'>*</span></span>}
                                                      form={form}
                                                      placeholder={"Write Symptom description here..."}
                                                      height={"150px"}
                                                  />
                                              </div>
                                              <div className='col-span-2'>
                                                  <TextareaField
                                                      field={'medications_taken'}
                                                      disabled={true}
                                                      label_text={<span>Medication taken<span className='text-red-500'>*</span></span>}
                                                      form={form}
                                                      placeholder={"Taken Medication in response..."}
                                                      height={"150px"}
                                                  />
                                              </div>
                                              <div className='col-span-2'>
                                                  <TextareaField
                                                      field={'comments'}
                                                      disabled={true}
                                                      label_text={<span>Comments<span className='text-red-500'>*</span></span>}
                                                      form={form}
                                                      placeholder={"write any comment here..."}
                                                      height={"150px"}
                                                  />
                                              </div>
                                          </div>

                                      </div>
                                  </Form>
                              )
                          }
                      </Formik>
                  )
              }
          </Formik>
      </div>
  )
}

export default FormContainer

