import React from "react";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonItemOption,
  IonLabel,
  IonList,
} from "@ionic/react";
import styles from "./List.module.css";
import { trash } from "ionicons/icons";
import { useSocket } from "../../hooks/useSocket";
import { IRoom } from "../../types/Interfaces";

function List({ items }: { items: IRoom[] | null }) {
  const { deleteRoom } = useSocket();
  console.log(items);

  return (
    <IonList>
      {items?.map((item) => {
        return (
          <IonItem key={item?.id} routerLink={`chat/${item.id}`}>
            <IonLabel>{item?.name}</IonLabel>
            <IonContent className={styles.content}>
              <p>
                {item?.messages &&
                  item.messages[item.messages.length - 1]?.text}{" "}
              </p>
            </IonContent>
            <IonItemOption
              onClick={async (e) => {
                e.stopPropagation();
                deleteRoom(item.id);
              }}
              color="danger"
              expandable={true}
            >
              <IonIcon slot="icon-only" icon={trash}></IonIcon>
            </IonItemOption>
          </IonItem>
        );
      })}
    </IonList>
  );
}
export default List;
