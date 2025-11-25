import { FunctionComponent } from "react";
import { Notification as NotificationType } from "../../stores/notificationStore";
import * as styles from "./styles.css";

type NotificationProps = {
  notification: NotificationType;
  onRemove: (id: string) => void;
};

export const Notification: FunctionComponent<NotificationProps> = ({ notification, onRemove }) => {
  return (
    <div className={styles.notification}>
      <span className={styles.message}>{notification.message}</span>
      <button className={styles.closeButton} onClick={() => onRemove(notification.id)}>
        ×
      </button>
    </div>
  );
};
