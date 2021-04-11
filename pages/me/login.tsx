import React, { useEffect, useState } from "react";
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

  const login = formValue => {
    setFormState({ isLoading: true });
    fetchJson("/api/user/login", formValue)
      .then(({ active }) =>
        router.push(active ? Route.TRADE : Route.VERIFY)
      )
      .catch(({ errorMessage }) => {
        setFormState({
          isLoading: false,
          errorMessage,
        });
      });
  };

  return (
    <Form
      title="Login"
      form={{
        username: { label: "Benutzername", type: "text" },
        password: { label: "Password", type: "password" },
      }}
      formDisabled={formState.isLoading}
      errorMessage={formState.errorMessage}
      submitDisabled={!!formState.errorMessage || formState.isLoading}
      onFormValueChange={removeErrorMessage}
      onSubmit={login}
    />
  );
}
