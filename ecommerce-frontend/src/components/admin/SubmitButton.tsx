import React from "react";
import { useNavigation } from "react-router";

interface SubmitButtonType {
  formBtn?: string;
}

const SubmitButton: React.FC<SubmitButtonType> = ({ formBtn }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <button
      type="submit"
      className={`btn btn-block ${formBtn && "form-btn"}`}
      disabled={isSubmitting}
    >
      {isSubmitting ? "submitting..." : "submit"}
    </button>
  );
};

export default SubmitButton;
