
import * as React from "react"

interface PrintOnlyProps {
    children: React.ReactNode; // this is the type for child components
}

export default function PrintOnly({ children }: PrintOnlyProps) {
    return (
      <span className="d-none d-print-inline">
        {children}
      </span>
    );
}