import { useRouter } from "next/router";
import React, { useState } from "react";
import { ModalForm } from "../../components/ModalForm";
import { fetchJson } from "../../util/fetchJson";
import { setJwt } from "../../util/jwt";
import { Route } from "../../util/routes";

export default function Home() {
  const [formState, setFormState] = useState<{
    errorMessage?: string;
    isLoading: boolean;
  }>({ isLoading: false });
  const removeErrorMessage = () =>
    setFormState(state => ({ ...state, errorMessage: null }));
  const router = useRouter();

  const signup = formValue => {
    setFormState({ isLoading: true });
    fetchJson("/api/user/signup", formValue)
      .then(({ jwt }) => {
        setJwt(jwt);
        router.push(Route.VERIFY);
      })
      .catch(({ errorMessage }) =>
        setFormState({ isLoading: false, errorMessage })
      );
  };

  return (
    <ModalForm
      title="Signup"
      form={{
        username: { label: "Benutzername", type: "text" },
        password: { label: "Password", type: "password" },
        passwordRetype: { label: "Password wiederholen", type: "password" },
        phone: { label: "Telefonnummer", type: "text" },
      }}
      formDisabled={formState.isLoading}
      errorMessage={formState.errorMessage}
      submitDisabled={!!formState.errorMessage || formState.isLoading}
      onFormValueChange={removeErrorMessage}
      onSubmit={signup}
    />
  );
}
