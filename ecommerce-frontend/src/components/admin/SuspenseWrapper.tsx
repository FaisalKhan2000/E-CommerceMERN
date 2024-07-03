import React, { ReactNode, Suspense } from "react";
import Loader from "./Loader";

interface SuspenseWrapperProps {
  children: ReactNode;
}

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({ children }) => {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
};

export default SuspenseWrapper;
