import React, { useEffect, useState } from "react";
import { fetchJson } from "../../util/fetchJson";
import { useRouter } from "next/router";
import { setJwt, useJwt } from "../../util/jwt";
import { ModalForm } from "../../components/ModalForm";
import { Route } from "../../util/routes";

export default function Home() {
  const [formState, setFormState] = useState<{
    errorMessage?: string;
    isLoading: boolean;
  }>({ isLoading: false });
  const removeErrorMessage = () =>
    setFormState(state => ({ ...state, errorMessage: null }));
  const jwt = useJwt({ dontRedirectTo: Route.LOGIN });
  const router = useRouter();

  const login = formValue => {
    setFormState({ isLoading: true });
    fetchJson("/api/user/login", formValue)
      .then(({ jwt }) => {
        setJwt(jwt);
        router.push(Route.DASHBOARD);
      })
      .catch(({ errorMessage }) => {
        setFormState({
          isLoading: false,
          errorMessage,
        });
      });
  };
  useEffect(() => {
    if (jwt) {
      router.replace(Route.DASHBOARD);
    }
  });

  return (
    <ModalForm
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
