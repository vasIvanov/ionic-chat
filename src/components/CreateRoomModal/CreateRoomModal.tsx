import React, { useState, useRef } from "react";
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonInput,
} from "@ionic/react";

function CreateRoomModal() {
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  function confirm() {
    modal.current?.dismiss(input.current?.value, "confirm");
  }

  return (
    <>
      <IonButton id="open-modal" expand="block">
        + Add Room
      </IonButton>
      <IonModal ref={modal} trigger="open-modal">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                onClick={() => {
                  modal.current?.dismiss();
                }}
              >
                Cancel
              </IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={() => confirm()}>
                Confirm
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonInput
              label="Enter room name"
              labelPlacement="stacked"
              ref={input}
              type="text"
              placeholder="Room name"
            />
          </IonItem>
        </IonContent>
      </IonModal>
    </>
  );
}

export default CreateRoomModal;
