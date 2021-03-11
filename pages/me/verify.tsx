import React, { useState } from "react";
import { fetchJson } from "../../util/fetchJson";
import { useRouter } from "next/router";
import { Form } from "../../components/Form";
import { Route } from "../../util/routes";

export default function Home() {
  const [formState, setFormState] = useState<{
    errorMessage?: string;
    isLoading: boolean;
  }>({ isLoading: false });
  const removeErrorMessage = () =>
    setFormState(state => ({ ...state, errorMessage: null }));
  const router = useRouter();
  const verify = formValue => {
    setFormState({ isLoading: true });
    fetchJson("/api/user/verify", formValue)
      .then(() => router.push(Route.TRADE))
      .catch(({ errorMessage }) =>
        setFormState({ isLoading: false, errorMessage })
      );
  };

  return (
    <Form
      title="Verify"
      form={{
        token: { label: "SMS Token", type: "number" },
      }}
      formDisabled={formState.isLoading}
      errorMessage={formState.errorMessage}
      submitDisabled={!!formState.errorMessage || formState.isLoading}
      onFormValueChange={removeErrorMessage}
      onSubmit={verify}
    />
  );
}
