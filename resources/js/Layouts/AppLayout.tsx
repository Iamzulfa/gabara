// resources/js/Layouts/AppLayout.tsx
import React, { ReactNode } from "react";
import AppNavbar from "@/Components/app/AppNavbar";

type Props = {
    children: ReactNode;
};

export default function AppLayout({ children }: Props) {
    return (
        <AppNavbar>
            <main className="flex-1">{children}</main>
        </AppNavbar>
    );
}
