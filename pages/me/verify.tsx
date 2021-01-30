import React, { useState } from "react";
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
  const jwt = useJwt({ dontRedirectTo: Route.VERIFY });
  const router = useRouter();
  const verify = formValue => {
    setFormState({ isLoading: true });
    fetchJson("/api/user/verify-phone", { ...formValue, username: jwt.name })
      .then(({ jwt }) => {
        setJwt(jwt);
        router.push(Route.DASHBOARD);
      })
      .catch(({ errorMessage }) => {
        console.log("ERROR");
        setFormState(state => ({ isLoading: false, errorMessage }));
      });
  };

  return (
    <ModalForm
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
