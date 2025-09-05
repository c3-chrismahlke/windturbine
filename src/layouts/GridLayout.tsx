import { ReactNode } from "react";
import styles from "@styles/layout.module.css";

interface GridLayoutProps {
  children: ReactNode;
}

export default function GridLayout({ children }: GridLayoutProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
