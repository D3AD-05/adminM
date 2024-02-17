import "./FormInput.css";
function FormInput(props) {
  const { label, name, onChange, id, errorMessage, ...inputProps } = props;

  return (
    <div className="formInput">
      <label>{label}</label>
      <input
        name={props.name}
        value={props.value}
        {...inputProps}
        onChange={onChange}
      />
      <span className="erorMsg">{errorMessage}</span>
    </div>
  );
}

export default FormInput;
