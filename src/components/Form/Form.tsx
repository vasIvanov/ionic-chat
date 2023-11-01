import React, { FormEvent } from "react";
import styles from "./Form.module.css";

const Form = ({
  placeholder,
  onSubmit,
  onChange,
}: {
  placeholder: string;
  onSubmit?: (e: FormEvent) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}>
        <input onChange={onChange} type="text" placeholder={placeholder} />
        <button className={styles.button} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
