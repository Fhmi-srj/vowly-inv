import * as React from "react";
import { useStore } from "@nanostores/react";
import { activeAdminTabStore } from "../../../store/adminStore";
import PlatformOverview from "./PlatformOverview";
import ComingSoon from "./ComingSoon";
import UserManagement from "./UserManagement";
import InvitationManagement from "./InvitationManagement";
import TemplateRegistry from "./TemplateRegistry";

const AdminPanel: React.FC = () => {
    const activeTab = useStore(activeAdminTabStore);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <PlatformOverview />;
            case 'users':
                return <UserManagement />;
            case 'invitations':
                return <InvitationManagement />;
            case 'templates':
                return <TemplateRegistry />;
            case 'payments':
                return <ComingSoon title="Daftar Transaksi" />;
            default:
                return <PlatformOverview />;
        }
    };

    return (
        <div className="animate-reveal">
            {renderContent()}
        </div>
    );
};

export default AdminPanel;
