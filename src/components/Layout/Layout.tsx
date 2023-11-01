import React from "react";
import { IonHeader, IonTitle, IonToolbar, isPlatform } from "@ionic/react";

type Props = {
  children: JSX.Element;
  title?: string;
  toolbarButton?: () => JSX.Element;
  style?: Record<string, string>;
  username?: string;
};
const Layout = ({ children, title, toolbarButton, style, username }: Props) => {
  return (
    <div style={style}>
      <IonHeader>
        <IonToolbar>
          {toolbarButton && toolbarButton()}
          <IonTitle>
            <div
              style={{
                display:
                  isPlatform("ios") || isPlatform("android") ? "block" : "flex",
                justifyContent: "space-between",
              }}
            >
              {title && <p>{title}</p>}
              {username && <p style={{ color: "grey" }}>{`${username}`}</p>}
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      {children}
    </div>
  );
};

export default Layout;
