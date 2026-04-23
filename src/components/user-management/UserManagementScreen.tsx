"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactElement } from "react";
import styles from "./UserManagementScreen.module.css";
import { StatusBadge, FilterPill, MainBtn, IconBtn, Checkbox, Dropdown, SearchBar, TextField } from "@scvcashenable/ui";
import {
  Users as UsersIcon,
  Briefcase as BriefcaseIcon,
  ShieldCheck as ShieldIcon,
  Bell as BellIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  Mail as MailIcon,
  MessageSquare as MessageIcon,
  Link as LinkIcon,
  Send as SendIcon,
  Lock as LockIcon,
  Trash2 as TrashIcon,
  Pencil as PencilIcon,
  X as CloseIcon,
  Check as CheckIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  MoreVertical as DotsVerticalIcon,
  Copy as CopyIcon,
} from "lucide-react";

type UserStatus = "active" | "waiting" | "locked";

type RoleAssignment = {
  id: string;
  label: string;
  scope: string;
};

type UserRecord = {
  id: string;
  userId: string;
  name: string;
  initials: string;
  email: string;
  whatsapp: string;
  jobTitle: string;
  status: UserStatus;
  company: string;
  parentCompany: string;
  role: string;
  assignments: RoleAssignment[];
  verificationSentTo: "email" | "whatsapp" | "";
  verificationSentToContact: string;
  lastRegeneratedPin?: string;
};

type NewUserFormState = {
  name: string;
  jobTitle: string;
  phoneNumber: string;
  email: string;
  company: string;
  role: string;
};

type NewUserRoleEntry = {
  id: string;
  company: string;
  role: string;
};

type AccessLevel = "no-access" | "view-only" | "full-access";
type ActiveScreen = "user-management" | "role-access";

type UserMgmtPermission = {
  level: AccessLevel;
  canSuspend: boolean;
  canAssignToCompanies: boolean;
  canRegeneratePin: boolean;
};

type RoleMgmtPermission = {
  level: AccessLevel;
};

type EntityMgmtPermission = {
  level: AccessLevel;
  canSuspend: boolean;
};

type RolePermissions = {
  userManagement: UserMgmtPermission;
  roleManagement: RoleMgmtPermission;
  entityManagement: EntityMgmtPermission;
};

type RoleRecord = {
  id: string;
  name: string;
  description: string;
  isPredefined: boolean;
  userCount: number;
  status: "active" | "inactive";
  permissions: RolePermissions;
};

type EditableProfileField = "name" | "email" | "whatsapp";
type PendingPanelAction =
  | { type: "select-user"; userId: string }
  | { type: "close-panel" }
  | { type: "open-new-user" }
  | { type: "change-screen"; screen: ActiveScreen }
  | { type: "delete-user" }
  | { type: "suspend-user" }
  | { type: "revoke-suspend" }
  | { type: "external-link"; href: string; target: "_self" | "_blank" }
  | null;

type ConfirmActionType = "delete" | "suspend" | "revoke-suspend" | "resend-verification";
type VerificationResendAction = {
  selectedChannel: "email" | "whatsapp";
  emailContact: string;
  whatsappContact: string;
};

type PanelRoleRowError = {
  company?: string;
  role?: string;
};

type IconProps = {
  className?: string;
};

type FilterOption = {
  value: string;
  label: string;
};

function getPinBlockDurationMs(attempts: number): number {
  if (attempts <= 2) return 0;
  if (attempts <= 5) return 60_000;
  if (attempts === 6) return 300_000;
  if (attempts === 7) return 900_000;
  if (attempts === 8) return 3_600_000;
  if (attempts === 9) return 32_400_000;
  return 86_400_000;
}

function formatPinBlockRemaining(ms: number): string {
  const totalSecs = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const USERS: UserRecord[] = [
  {
    id: "gaizka",
    userId: "G3X1",
    name: "Gaizka",
    initials: "G",
    email: "gaizka@labamu.com",
    whatsapp: "-",
    jobTitle: "Invited User",
    status: "waiting",
    company: "Sogo Indo Indonesia",
    parentCompany: "Sogo Group International",
    role: "Invited User",
    assignments: [],
    verificationSentTo: "email",
    verificationSentToContact: "gaizka@labamu.com",
  },
  {
    id: "sogo-halo-owner",
    userId: "SH2K",
    name: "Sogo Halo Owner",
    initials: "SH",
    email: "sogonew@yopmail.com",
    whatsapp: "-",
    jobTitle: "Super Admin",
    status: "active",
    company: "Sogo Indo Indonesia",
    parentCompany: "Sogo Group International",
    role: "Super Admin",
    assignments: [
      {
        id: "super-admin",
        label: "Super Admin",
        scope: "Sogo Indo Indonesia",
      },
    ],
    verificationSentTo: "",
    verificationSentToContact: "",
    lastRegeneratedPin: "05-12-2026, 15:00",
  },
  {
    id: "rina-kusuma",
    userId: "RK4A",
    name: "Rina Kusuma",
    initials: "RK",
    email: "rina.kusuma@labamu.com",
    whatsapp: "+6281234567890",
    jobTitle: "Operations Manager",
    status: "active",
    company: "Sogo Indo Indonesia",
    parentCompany: "Sogo Group International",
    role: "Invited User",
    assignments: [{ id: "invited-user", label: "Invited User", scope: "Sogo Indo Indonesia" }],
    verificationSentTo: "",
    verificationSentToContact: "",
  },
  {
    id: "budi-santoso",
    userId: "BS7M",
    name: "Budi Santoso",
    initials: "BS",
    email: "budi.santoso@labamu.com",
    whatsapp: "+6289876543210",
    jobTitle: "Finance Controller",
    status: "active",
    company: "Sogo Indo Indonesia",
    parentCompany: "Sogo Group International",
    role: "Invited User",
    assignments: [{ id: "invited-user", label: "Invited User", scope: "Sogo Indo Indonesia" }],
    verificationSentTo: "",
    verificationSentToContact: "",
  },
  {
    id: "dewi-anggraini",
    userId: "DA9P",
    name: "Dewi Anggraini",
    initials: "DA",
    email: "dewi.anggraini@labamu.com",
    whatsapp: "+6282109876543",
    jobTitle: "HR Specialist",
    status: "active",
    company: "Sogo Indo Indonesia",
    parentCompany: "Sogo Group International",
    role: "Invited User",
    assignments: [{ id: "invited-user", label: "Invited User", scope: "Sogo Indo Indonesia" }],
    verificationSentTo: "",
    verificationSentToContact: "",
  },
];

const SIDEBAR_ITEMS = [
  { id: "user-management", label: "User Management", icon: UsersIcon },
  { id: "entity-management", label: "Entity Management", icon: BriefcaseIcon },
  { id: "role-access", label: "Role Access", icon: ShieldIcon },
];

const ROLE_ASSIGNMENT_OPTIONS = [
  { value: "", label: "Select role" },
  { value: "Super Admin", label: "Super Admin" },
  { value: "Invited User", label: "Invited User" },
];

const COMPANY_ASSIGNMENT_OPTIONS = [
  { value: "", label: "Select company" },
  { value: "Sogo Indo Indonesia", label: "Sogo Indo Indonesia" },
];

const INITIAL_NEW_USER_FORM: NewUserFormState = {
  name: "",
  jobTitle: "",
  phoneNumber: "",
  email: "",
  company: "",
  role: "",
};

const COUNTRY_CODES = [
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
];


const PAGE_SIZE_OPTIONS = ["25", "50", "100"];
const ROLE_PAGE_SIZE = 10;

const INITIAL_ROLE_PERMISSIONS: RolePermissions = {
  userManagement: { level: "no-access", canSuspend: false, canAssignToCompanies: false, canRegeneratePin: false },
  roleManagement: { level: "no-access" },
  entityManagement: { level: "no-access", canSuspend: false },
};

const PREDEFINED_ROLES: RoleRecord[] = [
  {
    id: "manager",
    name: "Manager",
    description: "Full access with suspend, assign & PIN regenerate",
    isPredefined: true,
    userCount: 1,
    status: "active",
    permissions: {
      userManagement: { level: "full-access", canSuspend: true, canAssignToCompanies: true, canRegeneratePin: true },
      roleManagement: { level: "full-access" },
      entityManagement: { level: "full-access", canSuspend: false },
    },
  },
  {
    id: "finance",
    name: "Finance",
    description: "View-only access across all modules",
    isPredefined: true,
    userCount: 0,
    status: "active",
    permissions: {
      userManagement: { level: "view-only", canSuspend: false, canAssignToCompanies: false, canRegeneratePin: false },
      roleManagement: { level: "view-only" },
      entityManagement: { level: "view-only", canSuspend: false },
    },
  },
  {
    id: "operational-manager",
    name: "Operational Manager",
    description: "Full access to users & entities with suspend",
    isPredefined: true,
    userCount: 0,
    status: "active",
    permissions: {
      userManagement: { level: "full-access", canSuspend: true, canAssignToCompanies: false, canRegeneratePin: false },
      roleManagement: { level: "view-only" },
      entityManagement: { level: "full-access", canSuspend: false },
    },
  },
];

const ACCESS_LEVEL_OPTIONS: { value: AccessLevel; label: string }[] = [
  { value: "no-access", label: "No Access" },
  { value: "view-only", label: "View Only" },
  { value: "full-access", label: "Full Access" },
];

function buildPermCounts(perms: RolePermissions) {
  const levels = [perms.userManagement.level, perms.roleManagement.level, perms.entityManagement.level];
  return {
    fullAccess: levels.filter((l) => l === "full-access").length,
    viewOnly: levels.filter((l) => l === "view-only").length,
    noAccess: levels.filter((l) => l === "no-access").length,
  };
}

const CONFIRMATION_ILLUSTRATION = "https://www.figma.com/api/mcp/asset/0b9b7ac2-cb3c-49fd-b2c8-9eac06c83760";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function toInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "NU";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function toUserId(name: string) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${base || "user"}-${Date.now()}`;
}

function generateUserId(existingIds: string[]): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id: string;
  do {
    id = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  } while (existingIds.includes(id));
  return id;
}

function toWhatsAppHref(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

function splitPhoneNumber(phoneNumber: string) {
  const normalized = phoneNumber.replace(/\s+/g, "");
  const matchedCode = [...COUNTRY_CODES]
    .sort((left, right) => right.code.length - left.code.length)
    .find((item) => normalized.startsWith(item.code));

  if (!matchedCode) {
    return {
      countryCode: "+62",
      phone: normalized.replace(/\D/g, ""),
    };
  }

  return {
    countryCode: matchedCode.code,
    phone: normalized.slice(matchedCode.code.length).replace(/\D/g, ""),
  };
}

function getUserContactChannel(user: UserRecord | undefined) {
  if (!user) {
    return "";
  }

  if (user.verificationSentTo === "email" && user.email !== "-") {
    return "email";
  }

  if (user.verificationSentTo === "whatsapp" && user.whatsapp !== "-") {
    return "whatsapp";
  }

  return user.verificationSentTo;
}

function getUserVerificationContact(user: UserRecord | undefined) {
  if (!user) {
    return "";
  }

  return user.verificationSentToContact || "";
}

function buildFilterOptions(values: string[]): FilterOption[] {
  return Array.from(new Set(values.filter(Boolean)))
    .sort((left, right) => left.localeCompare(right))
    .map((value) => ({
      value,
      label: value,
    }));
}

function AppGridIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="2" fill="currentColor" />
      <rect x="13" y="4" width="7" height="7" rx="2" fill="currentColor" />
      <rect x="4" y="13" width="7" height="7" rx="2" fill="currentColor" />
      <rect x="13" y="13" width="7" height="7" rx="2" fill="currentColor" />
    </svg>
  );
}


function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 3.25C6.272 3.25 3.25 6.202 3.25 9.844C3.25 11.307 3.741 12.66 4.572 13.754L4 16.75L7.124 15.994C7.995 16.437 8.985 16.688 10 16.688C13.728 16.688 16.75 13.736 16.75 10.094C16.75 6.452 13.728 3.25 10 3.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.375 7.5C8.375 9.625 10.125 11.375 12.25 11.375"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12.625 11C12.454 11.281 12.154 11.5 11.875 11.5C10.08 11.5 8.25 9.67 8.25 7.875C8.25 7.596 8.469 7.296 8.75 7.125L9.156 6.875C9.344 6.759 9.588 6.802 9.724 6.976L10.25 7.648C10.37 7.8 10.38 8.012 10.273 8.176L9.95 8.672C10.161 9.105 10.645 9.589 11.078 9.8L11.574 9.477C11.738 9.37 11.95 9.38 12.102 9.5L12.774 10.026C12.948 10.162 12.991 10.406 12.875 10.594L12.625 11Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: ComponentType<IconProps>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button type="button" className={cx(styles.navItem, active && styles.navItemActive)} onClick={onClick}>
      {active ? <span className={styles.navItemIndicator} aria-hidden="true" /> : null}
      <Icon className={styles.navItemIcon} />
      <span>{label}</span>
    </button>
  );
}

function AccessBadgeCell({ level, extras }: { level: AccessLevel; extras?: string[] }) {
  const label = { "no-access": "No Access", "view-only": "View Only", "full-access": "Full Access" }[level];
  const variant = { "no-access": "grey", "view-only": "yellow", "full-access": "green" }[level] as "grey" | "yellow" | "green";
  return (
    <div className={styles.accessBadgeCell}>
      <StatusBadge variant={variant} label={label} />
      {extras?.map((e) => (
        <span key={e} className={styles.accessExtra}>+{e}</span>
      ))}
    </div>
  );
}

function MetricCard({
  label,
  value,
  status,
  selected = false,
  onClick,
}: {
  label: string;
  value: number;
  status: UserStatus;
  selected?: boolean;
  onClick?: () => void;
}) {
  const badgeClass = {
    active: styles.metricBadgeActive,
    waiting: styles.metricBadgeWaiting,
    locked: styles.metricBadgeLocked,
  }[status];

  return (
    <button type="button" className={cx(styles.metricCard, selected && styles.metricCardSelected)} onClick={onClick} aria-pressed={selected}>
      <span className={styles.metricLabel}>{label}</span>
      <span className={styles.metricCardMeta}>
        <span className={cx(styles.metricBadge, badgeClass)}>{value}</span>
        {selected ? <CloseIcon className={styles.metricCloseIcon} /> : <ChevronRightIcon className={styles.metricArrow} />}
      </span>
    </button>
  );
}

function StatusPill({ status }: { status: UserStatus }) {
  const label = { active: "Active", waiting: "Invited", locked: "Locked" }[status];
  const variant = { active: "green", waiting: "yellow", locked: "red" }[status] as "green" | "yellow" | "red";
  return <StatusBadge variant={variant} label={label} />;
}

function StatusCell({
  status,
  onResendVerification,
}: {
  status: UserStatus;
  onResendVerification?: () => void;
}) {
  return (
    <div className={styles.statusCell}>
      <StatusPill status={status} />
      {status === "waiting" && onResendVerification ? (
        <span
          role="button"
          tabIndex={0}
          className={styles.statusCta}
          onClick={(event) => {
            event.stopPropagation();
            onResendVerification?.();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.stopPropagation();
              onResendVerification?.();
            }
          }}
        >
          Resend Verification
        </span>
      ) : null}
    </div>
  );
}

function ActionIconButton({
  label,
  destructive = false,
  disabled = false,
  children,
}: {
  label: string;
  destructive?: boolean;
  disabled?: boolean;
  children: ReactElement;
}) {
  return (
    <IconBtn
      icon={children}
      aria-label={label}
      disabled={disabled}
      size="sm"
      variant="secondary"
      className={destructive ? "border-transparent bg-transparent text-lb-red hover:bg-lb-red-bg!" : "border-transparent bg-transparent text-lb-on-surface-2 hover:bg-lb-surface-grey"}
      onClick={(event) => event.stopPropagation()}
    />
  );
}


function AccessSelect({ value, onChange, disabled }: { value: AccessLevel; onChange: (v: AccessLevel) => void; disabled?: boolean }) {
  return (
    <Dropdown
      options={ACCESS_LEVEL_OPTIONS}
      value={value}
      onChange={(v) => onChange(v as AccessLevel)}
      disabled={disabled}
      className="w-40"
    />
  );
}

function PhoneField({
  code,
  phone,
  onCodeChange,
  onPhoneChange,
  phonePlaceholder = "Phone number",
  phoneInputId,
  fieldClassName,
  inputClassName,
}: {
  code: string;
  phone: string;
  onCodeChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
  phonePlaceholder?: string;
  phoneInputId?: string;
  fieldClassName?: string;
  inputClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = COUNTRY_CODES.filter((c) =>
    `${c.code} ${c.country}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className={styles.phoneFieldContainer}>
      <div className={cx(styles.editPhoneField, fieldClassName)}>
        <button
          type="button"
          className={cx(styles.editPhonePrefixBtn, open && styles.editPhonePrefixBtnOpen)}
          onClick={() => setOpen((o) => !o)}
        >
          <span>{code}</span>
          <ChevronDownIcon className={cx(styles.editPhonePrefixChevron, open && styles.editPhonePrefixChevronUp)} />
        </button>
        <input
          id={phoneInputId}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, ""))}
          className={cx(styles.editPhoneInput, inputClassName)}
          placeholder={phonePlaceholder}
        />
      </div>
      {open && (
        <div className={styles.phoneCodeDropdown}>
          <div className={styles.phoneCodeDropdownSearchWrap}>
            <div className={styles.phoneCodeDropdownSearch}>
              <SearchIcon className={styles.phoneCodeDropdownSearchIcon} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className={styles.phoneCodeDropdownSearchInput}
                autoFocus
              />
            </div>
          </div>
          <div className={styles.phoneCodeDropdownList}>
            {filtered.map((c, i) => (
              <div key={c.code} className={styles.phoneCodeDropdownItemWrap}>
                <button
                  type="button"
                  className={styles.phoneCodeDropdownItem}
                  onClick={() => { onCodeChange(c.code); setOpen(false); setSearch(""); }}
                >
                  <span className={cx(styles.phoneCodeDropdownItemText, code === c.code && styles.phoneCodeDropdownItemTextSelected)}>
                    {c.code} - {c.country}
                  </span>
                  {code === c.code && <CheckIcon className={styles.phoneCodeDropdownItemCheck} />}
                </button>
                {i < filtered.length - 1 && <div className={styles.phoneCodeDropdownSeparator} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PanelLabel({ children }: { children: string }) {
  return <span className={styles.panelLabel}>{children}</span>;
}

export function UserManagementScreen() {
  const [users, setUsers] = useState<UserRecord[]>(USERS);
  const [roleFilters, setRoleFilters] = useState<string[]>([]);
  const [companyFilters, setCompanyFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<UserStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("sogo-halo-owner");
  const [pageSize, setPageSize] = useState("25");
  const [detailVisible, setDetailVisible] = useState(true);
  const [showAddRoleFields, setShowAddRoleFields] = useState(false);
  const [pendingRole, setPendingRole] = useState("");
  const [pendingCompany, setPendingCompany] = useState("");
  const [pendingRoleError, setPendingRoleError] = useState("");
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserFormState>(INITIAL_NEW_USER_FORM);
  const [newUserRoleError, setNewUserRoleError] = useState("");
  const [editingField, setEditingField] = useState<EditableProfileField | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [pendingPanelAction, setPendingPanelAction] = useState<PendingPanelAction>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionType | null>(null);
  const [newUserRoles, setNewUserRoles] = useState<NewUserRoleEntry[]>([
    { id: "role-init", company: "", role: "" },
  ]);
  const [newUserNameError, setNewUserNameError] = useState("");
  const [newUserJobTitleError, setNewUserJobTitleError] = useState("");
  const [newUserContactError, setNewUserContactError] = useState("");
  const [newUserPhoneCountryCode, setNewUserPhoneCountryCode] = useState("+62");
  const [verificationChannel, setVerificationChannel] = useState<"email" | "whatsapp" | "">("");
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("user-management");
  const [roles, setRoles] = useState<RoleRecord[]>(PREDEFINED_ROLES);
  const [permConfigRole, setPermConfigRole] = useState<RoleRecord | null>(null);
  const [editingPerms, setEditingPerms] = useState<RolePermissions>(INITIAL_ROLE_PERMISSIONS);
  const [editingRoleName, setEditingRoleName] = useState("");
  const [editingRoleDesc, setEditingRoleDesc] = useState("");
  const [isNewRole, setIsNewRole] = useState(false);
  const [roleNameError, setRoleNameError] = useState("");
  const [roleSearchQuery, setRoleSearchQuery] = useState("");
  const [rolePage, setRolePage] = useState(1);
  const [rolePageSize, setRolePageSize] = useState(10);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Successfully Saved");
  const [panelName, setPanelName] = useState("");
  const [panelJobTitle, setPanelJobTitle] = useState("");
  const [panelEmail, setPanelEmail] = useState("");
  const [panelPhone, setPanelPhone] = useState("");
  const [panelRoleRows, setPanelRoleRows] = useState<NewUserRoleEntry[]>([]);
  const [panelRoleRowErrors, setPanelRoleRowErrors] = useState<Record<string, PanelRoleRowError>>({});
  const [panelJobTitleError, setPanelJobTitleError] = useState("");
  const [panelContactError, setPanelContactError] = useState(false);
  const [panelPhoneCountryCode, setPanelPhoneCountryCode] = useState("+62");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinVisible, setPinVisible] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [pinBlockedUntil, setPinBlockedUntil] = useState<number | null>(null);
  const [pinBlockTick, setPinBlockTick] = useState(0);
  const [resendVerificationPrompt, setResendVerificationPrompt] = useState<VerificationResendAction | null>(null);
  const pinInputRef = useRef<HTMLInputElement>(null);
  const [showRegeneratePinModal, setShowRegeneratePinModal] = useState(false);
  const [regeneratePinValue, setRegeneratePinValue] = useState("");
  const [regeneratePinError, setRegeneratePinError] = useState("");
  const [regeneratePinVisible, setRegeneratePinVisible] = useState(false);
  const [pinModalOtpMode, setPinModalOtpMode] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpTimerActive, setOtpTimerActive] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpPurpose, setOtpPurpose] = useState<"regenerate-pin" | "contact-save" | "invite-user" | "delete-user" | "lock-user" | "unlock-user">("regenerate-pin");
  const [showActionPinModal, setShowActionPinModal] = useState(false);
  const [actionPinType, setActionPinType] = useState<"invite-user" | "delete-user" | "lock-user" | "unlock-user" | null>(null);
  const [actionPinValue, setActionPinValue] = useState("");
  const [actionPinError, setActionPinError] = useState("");
  const [actionPinVisible, setActionPinVisible] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [panelLastRegeneratedPin, setPanelLastRegeneratedPin] = useState<string | undefined>(undefined);
  const [nameError, setNameError] = useState("");
  const [otpChannel, setOtpChannel] = useState<"email" | "whatsapp">("email");
  const [showResendChannelModal, setShowResendChannelModal] = useState(false);
  const [otpResendAttemptsRemaining, setOtpResendAttemptsRemaining] = useState(5);

  const roleFilterOptions = buildFilterOptions(users.map((user) => user.role));
  const companyFilterOptions = buildFilterOptions(users.map((user) => user.company));
  const baseFilteredUsers = users.filter((user) => {
    const matchesRole = roleFilters.length === 0 || roleFilters.includes(user.role);
    const matchesCompany = companyFilters.length === 0 || companyFilters.includes(user.company);
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedQuery.length === 0 ||
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery);

    return matchesRole && matchesCompany && matchesSearch;
  });

  const filteredUsers =
    statusFilters.length === 0
      ? baseFilteredUsers
      : baseFilteredUsers.filter((user) => statusFilters.includes(user.status));

  const selectedUser =
    filteredUsers.find((user) => user.id === selectedUserId) ||
    users.find((user) => user.id === selectedUserId) ||
    filteredUsers[0] ||
    users[0];

  const totalUsers = users.length;
  const activeUsers = baseFilteredUsers.filter((user) => user.status === "active").length;
  const invitedUsers = baseFilteredUsers.filter((user) => user.status === "waiting").length;
  const lockedUsers = baseFilteredUsers.filter((user) => user.status === "locked").length;
  const filterMenus = [
    {
      id: "role" as const,
      label: "Role",
      selectedValues: roleFilters,
      options: roleFilterOptions,
      onChangeMultiple: (nextValues: string[]) => setRoleFilters(nextValues),
    },
    {
      id: "company" as const,
      label: "Company",
      selectedValues: companyFilters,
      options: companyFilterOptions,
      onChangeMultiple: (nextValues: string[]) => setCompanyFilters(nextValues),
    },
  ].sort((left, right) => Number(right.selectedValues.length > 0) - Number(left.selectedValues.length > 0));
  const inlineOriginalValue =
    editingField && selectedUser
      ? (() => {
          const nextValue =
            editingField === "name"
              ? selectedUser.name
              : editingField === "email"
                ? selectedUser.email
              : selectedUser.whatsapp;
          return nextValue === "-" ? "" : nextValue;
        })()
      : "";
  const hasInlineUnsavedChanges = editingField !== null && editingValue !== inlineOriginalValue;
  const panelRoleRowsSnapshot = selectedUser
    ? JSON.stringify(
        panelRoleRows
          .filter((row) => row.company.trim() || row.role.trim())
          .map((row) => ({
            company: row.company,
            role: row.role,
          })),
      )
    : "";
  const selectedUserRoleSnapshot = selectedUser
    ? JSON.stringify(
        selectedUser.assignments.map((assignment) => ({
          company: assignment.scope,
          role: assignment.label,
        })),
    )
    : "";
  const currentWhatsappDraft = panelPhone.trim() ? `${panelPhoneCountryCode}${panelPhone.trim()}` : "";
  const savedWhatsappValue = selectedUser ? (selectedUser.whatsapp === "-" ? "" : selectedUser.whatsapp) : "";
  const hasPanelDraftChanges =
    !!selectedUser &&
    (
      panelName.trim() !== selectedUser.name ||
      panelJobTitle.trim() !== (selectedUser.jobTitle || "") ||
      panelEmail.trim() !== (selectedUser.email === "-" ? "" : selectedUser.email) ||
      currentWhatsappDraft !== savedWhatsappValue ||
      panelRoleRowsSnapshot !== selectedUserRoleSnapshot
    );
  const hasUnsavedPanelChanges = hasInlineUnsavedChanges || hasPanelDraftChanges;
  const roleAccessPermissionsSnapshot = JSON.stringify(editingPerms);
  const selectedRolePermissionsSnapshot = JSON.stringify(permConfigRole?.permissions ?? INITIAL_ROLE_PERMISSIONS);
  const hasRoleAccessChanges =
    permConfigRole !== null &&
    (
      editingRoleName.trim() !== permConfigRole.name ||
      editingRoleDesc.trim() !== permConfigRole.description ||
      roleAccessPermissionsSnapshot !== selectedRolePermissionsSnapshot
    );
  const isRoleAccessSaveDisabled = !isNewRole && !hasRoleAccessChanges;
  const savedEmail = selectedUser?.email ?? "-";
  const savedWhatsapp = selectedUser?.whatsapp ?? "-";
  const savedVerificationChannel = getUserContactChannel(selectedUser);
  const savedVerificationContact = getUserVerificationContact(selectedUser);
  const openResendVerificationPrompt = () => {
    if (!selectedUser) return;
    const emailContact = selectedUser.email === "-" ? "" : selectedUser.email;
    const whatsappContact = selectedUser.whatsapp === "-" ? "" : selectedUser.whatsapp;
    if (!emailContact && !whatsappContact) return;

    const nextChannel =
      savedVerificationChannel ||
      (whatsappContact && !emailContact ? "whatsapp" : "email");

    setResendVerificationPrompt({
      selectedChannel: nextChannel,
      emailContact,
      whatsappContact,
    });
    setConfirmAction("resend-verification");
  };

  const openRegeneratePinModal = () => {
    setRegeneratePinValue("");
    setRegeneratePinError("");
    setRegeneratePinVisible(false);
    setShowRegeneratePinModal(true);
  };

  const closeRegeneratePinModal = () => {
    setShowRegeneratePinModal(false);
    setRegeneratePinValue("");
    setRegeneratePinError("");
    setRegeneratePinVisible(false);
    setPinModalOtpMode(false);
    setOtpValues(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpTimerActive(false);
  };

  const closeOtpModal = () => {
    setOtpValues(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpTimerActive(false);
    setShowResendChannelModal(false);
  };

  const switchToOtpMode = (purpose: "regenerate-pin" | "contact-save" | "invite-user" | "delete-user" | "lock-user" | "unlock-user") => {
    setOtpPurpose(purpose);
    setOtpValues(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpTimer(30);
    setOtpTimerActive(true);
    setPinModalOtpMode(true);
    setOtpResendAttemptsRemaining(5);
    setOtpChannel(selectedUser?.email !== "-" ? "email" : "whatsapp");
  };

  const switchBackToPin = () => {
    setPinModalOtpMode(false);
    setOtpValues(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpTimerActive(false);
  };

  const formatPinTimestamp = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `${dd}-${mm}-${yyyy}, ${hh}:${min}`;
  };

  const stampRegeneratedPin = () => {
    const ts = formatPinTimestamp();
    setPanelLastRegeneratedPin(ts);
    setUsers((prev) =>
      prev.map((u) => u.id === selectedUserId ? { ...u, lastRegeneratedPin: ts } : u)
    );
  };

  const recordPinFailure = (setErr: (msg: string) => void) => {
    const next = pinAttempts + 1;
    setPinAttempts(next);
    const blockMs = getPinBlockDurationMs(next);
    if (blockMs > 0) {
      setPinBlockedUntil(Date.now() + blockMs);
      setPinBlockTick(0);
      setErr("");
    } else {
      setErr("Incorrect PIN.");
    }
  };

  const isPinCurrentlyBlocked = () => !!(pinBlockedUntil && Date.now() < pinBlockedUntil);

  const confirmRegeneratePin = () => {
    if (isPinCurrentlyBlocked()) {
      setRegeneratePinError(`PIN blocked. Try again in ${formatPinBlockRemaining(pinBlockedUntil! - Date.now())}.`);
      return;
    }
    if (regeneratePinValue.length < 6) {
      setRegeneratePinError("Please enter your 6-digit PIN.");
      return;
    }
    if (regeneratePinValue !== "000000") {
      recordPinFailure(setRegeneratePinError);
      return;
    }
    setPinAttempts(0);
    setPinBlockedUntil(null);
    closeRegeneratePinModal();
    stampRegeneratedPin();
    setSnackbarMessage("PIN Regenerated Successfully");
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const confirmOtpWithValues = (values: string[]) => {
    const code = values.join("");
    if (code.length < 6) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }
    if (code !== "000000") {
      setOtpError("Incorrect OTP. Please try again.");
      return;
    }
    closeOtpModal();
    setShowPinModal(false);
    setShowRegeneratePinModal(false);
    setShowActionPinModal(false);
    setPinModalOtpMode(false);
    if (otpPurpose === "contact-save") {
      executeSavePanelEdit();
      if (resendVerificationPrompt) {
        setConfirmAction("resend-verification");
      }
    } else if (otpPurpose === "invite-user") {
      executeCreateUser();
    } else if (otpPurpose === "delete-user" || otpPurpose === "lock-user" || otpPurpose === "unlock-user") {
      executeConfirmAction();
    } else {
      stampRegeneratedPin();
      setSnackbarMessage("PIN Regenerated Successfully");
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    }
  };


  const resendOtp = () => {
    if (otpTimer > 0 || otpResendAttemptsRemaining <= 0) return;
    const hasBothContacts = selectedUser?.email !== "-" && selectedUser?.whatsapp !== "-";
    if (hasBothContacts) {
      setShowResendChannelModal(true);
      return;
    }
    setOtpResendAttemptsRemaining((prev) => prev - 1);
    setOtpValues(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpTimer(30);
    setOtpTimerActive(true);
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  const selectResendChannel = (channel: "email" | "whatsapp") => {
    setOtpChannel(channel);
    setShowResendChannelModal(false);
    setOtpResendAttemptsRemaining((prev) => Math.max(0, prev - 1));
    setOtpValues(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpTimer(30);
    setOtpTimerActive(true);
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newValues = [...otpValues];
    newValues[index] = digit;
    setOtpValues(newValues);
    if (otpError) setOtpError("");
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    if (digit && index === 5 && newValues.every(v => v !== "")) {
      confirmOtpWithValues(newValues);
    }
  };

  const handleOtpKeyDown = (index: number, e: { key: string }) => {
    if (e.key === "Backspace") {
      if (otpValues[index]) {
        const newValues = [...otpValues];
        newValues[index] = "";
        setOtpValues(newValues);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const openActionPinModal = (type: "invite-user" | "delete-user" | "lock-user" | "unlock-user") => {
    setActionPinType(type);
    setActionPinValue("");
    setActionPinError("");
    setActionPinVisible(false);
    setShowActionPinModal(true);
  };

  const closeActionPinModal = () => {
    setShowActionPinModal(false);
    setActionPinType(null);
    setActionPinValue("");
    setActionPinError("");
    setActionPinVisible(false);
    setPinModalOtpMode(false);
    setOtpValues(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpTimerActive(false);
  };

  const confirmActionPin = () => {
    if (isPinCurrentlyBlocked()) {
      setActionPinError(`PIN blocked. Try again in ${formatPinBlockRemaining(pinBlockedUntil! - Date.now())}.`);
      return;
    }
    if (actionPinValue.length < 6) {
      setActionPinError("Please enter your 6-digit PIN.");
      return;
    }
    if (actionPinValue !== "000000") {
      recordPinFailure(setActionPinError);
      return;
    }
    setPinAttempts(0);
    setPinBlockedUntil(null);
    closeActionPinModal();
    if (actionPinType === "invite-user") {
      executeCreateUser();
    } else {
      executeConfirmAction();
    }
  };

  const resetAddRoleForm = () => {
    setShowAddRoleFields(false);
    setPendingRole("");
    setPendingCompany("");
    setPendingRoleError("");
  };

  const openPermConfig = (role: RoleRecord) => {
    setPermConfigRole(role);
    setEditingPerms(role.permissions);
    setEditingRoleName(role.name);
    setEditingRoleDesc(role.description);
    setIsNewRole(false);
    setRoleNameError("");
  };

  const openAddRole = () => {
    setPermConfigRole({ id: "", name: "", description: "", isPredefined: false, userCount: 0, status: "active", permissions: INITIAL_ROLE_PERMISSIONS });
    setEditingPerms(INITIAL_ROLE_PERMISSIONS);
    setEditingRoleName("");
    setEditingRoleDesc("");
    setIsNewRole(true);
    setRoleNameError("");
  };

  const closePermConfig = () => {
    setPermConfigRole(null);
    setRoleNameError("");
  };

  const savePermConfig = () => {
    if (!editingRoleName.trim()) {
      setRoleNameError("Field cannot be empty.");
      return;
    }
    if (isNewRole) {
      const newRole: RoleRecord = {
        id: `role-${Date.now()}`,
        name: editingRoleName.trim(),
        description: editingRoleDesc.trim(),
        isPredefined: false,
        userCount: 0,
        status: "active",
        permissions: editingPerms,
      };
      setRoles((current) => [newRole, ...current.filter((r) => !r.isPredefined), ...current.filter((r) => r.isPredefined)]);
      // Stay open on the new role in edit mode
      setPermConfigRole(newRole);
      setIsNewRole(false);
      setRoleNameError("");
      setSnackbarMessage("Role created successfully");
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    } else if (permConfigRole) {
      setRoles((current) =>
        current.map((r) =>
          r.id === permConfigRole.id
            ? { ...r, name: editingRoleName.trim(), description: editingRoleDesc.trim(), permissions: editingPerms }
            : r,
        ),
      );
      setSnackbarMessage("Successfully Saved");
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    }
  };

  const deleteRole = (roleId: string) => {
    setRoles((current) => current.filter((r) => r.id !== roleId));
    closePermConfig();
  };

  const duplicateRole = (role: RoleRecord) => {
    let counter = 1;
    let newName = `${role.name} ${counter}`;
    while (roles.some((r) => r.name === newName)) { counter++; newName = `${role.name} ${counter}`; }
    const newRole: RoleRecord = {
      id: `role-${Date.now()}`,
      name: newName,
      description: role.description,
      isPredefined: false,
      userCount: 0,
      status: "active",
      permissions: {
        userManagement: { ...role.permissions.userManagement },
        roleManagement: { ...role.permissions.roleManagement },
        entityManagement: { ...role.permissions.entityManagement },
      },
    };
    setRoles((current) => [newRole, ...current.filter((r) => !r.isPredefined), ...current.filter((r) => r.isPredefined)]);
    openPermConfig(newRole);
  };

  const resetNewUserForm = () => {
    setIsNewUserOpen(false);
    setNewUserForm(INITIAL_NEW_USER_FORM);
    setNewUserRoleError("");
    setNewUserRoles([{ id: "role-init", company: "", role: "" }]);
    setNewUserNameError("");
    setNewUserJobTitleError("");
    setNewUserContactError("");
    setNewUserPhoneCountryCode("+62");
    setVerificationChannel("");
  };

  const startInlineEdit = (field: EditableProfileField) => {
    if (!selectedUser) {
      return;
    }

    if (editingField && editingField !== field) {
      return;
    }

    if (editingField === field) {
      return;
    }

    const nextValue =
      field === "name" ? selectedUser.name : field === "email" ? selectedUser.email : selectedUser.whatsapp;

    setEditingField(field);
    setEditingValue(nextValue === "-" ? "" : nextValue);
  };

  const cancelInlineEdit = () => {
    setEditingField(null);
    setEditingValue("");
  };

  const saveInlineEdit = () => {
    if (!selectedUser || !editingField) {
      return;
    }

    const trimmedValue = editingValue.trim();

    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user.id !== selectedUser.id) {
          return user;
        }

        if (editingField === "name") {
          const nextName = trimmedValue || user.name;
          return {
            ...user,
            name: nextName,
            initials: toInitials(nextName),
          };
        }

        if (editingField === "email") {
          return {
            ...user,
            email: trimmedValue || "-",
          };
        }

        return {
          ...user,
          whatsapp: trimmedValue || "-",
        };
      }),
    );

    cancelInlineEdit();
  };

  const executePanelAction = (action: Exclude<PendingPanelAction, null>) => {
    if (action.type === "select-user") {
      setSelectedUserId(action.userId);
      setDetailVisible(true);
      setIsNewUserOpen(false);
      return;
    }

    if (action.type === "open-new-user") {
      setIsNewUserOpen(true);
      setDetailVisible(false);
      return;
    }

    if (action.type === "change-screen") {
      setActiveScreen(action.screen);
      setIsNewUserOpen(false);
      setDetailVisible(action.screen === "user-management");
      if (action.screen === "role-access") {
        const sorted = [...roles.filter((r) => !r.isPredefined), ...roles.filter((r) => r.isPredefined)];
        if (sorted.length > 0) {
          openPermConfig(sorted[0]);
        }
      } else {
        setPermConfigRole(null);
        const topUser = filteredUsers[0] || users[0];
        if (topUser) setSelectedUserId(topUser.id);
      }
      return;
    }

    if (action.type === "external-link") {
      if (action.target === "_blank") {
        window.open(action.href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = action.href;
      }
      return;
    }

    if (action.type === "delete-user") {
      setConfirmAction("delete");
      return;
    }

    if (action.type === "suspend-user") {
      setConfirmAction("suspend");
      return;
    }

    if (action.type === "revoke-suspend") {
      setConfirmAction("revoke-suspend");
      return;
    }

    setDetailVisible(false);
    setIsNewUserOpen(false);
  };

  const requestPanelAction = (action: Exclude<PendingPanelAction, null>) => {
    if (hasUnsavedPanelChanges) {
      setPendingPanelAction(action);
      return;
    }

    cancelInlineEdit();
    executePanelAction(action);
  };

  const requestScreenChange = (screen: ActiveScreen) => {
    if (hasUnsavedPanelChanges) {
      setPendingPanelAction({ type: "change-screen", screen });
      return;
    }

    cancelInlineEdit();
    executePanelAction({ type: "change-screen", screen });
  };

  const toggleStatusFilter = (status: UserStatus | "all") => {
    if (status === "all") {
      setStatusFilters([]);
      return;
    }

    setStatusFilters((current) =>
      current.includes(status) ? current.filter((item) => item !== status) : [...current, status],
    );
  };

  const confirmDiscardChanges = () => {
    cancelInlineEdit();

    if (pendingPanelAction) {
      executePanelAction(pendingPanelAction);
      setPendingPanelAction(null);
    }
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setConfirmAction("delete");
  };

  const handleSuspendUser = () => {
    if (!selectedUser) return;
    setConfirmAction("suspend");
  };

  const handleRevokeSuspend = () => {
    if (!selectedUser) return;
    setConfirmAction("revoke-suspend");
  };

  const executeConfirmAction = () => {
    if (!confirmAction || !selectedUser) return;
    if (confirmAction === "delete") {
      setUsers((current) => current.filter((u) => u.id !== selectedUser.id));
      setDetailVisible(false);
      setSnackbarMessage("Deleted Successfully");
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    } else if (confirmAction === "suspend") {
      setUsers((current) =>
        current.map((u) => (u.id === selectedUser.id ? { ...u, status: "locked" as UserStatus } : u)),
      );
    } else if (confirmAction === "revoke-suspend") {
      setUsers((current) =>
        current.map((u) => (u.id === selectedUser.id ? { ...u, status: "active" as UserStatus } : u)),
      );
    } else if (confirmAction === "resend-verification" && resendVerificationPrompt) {
      const nextContact =
        resendVerificationPrompt.selectedChannel === "email"
          ? resendVerificationPrompt.emailContact
          : resendVerificationPrompt.whatsappContact;
      setUsers((current) =>
        current.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                verificationSentTo: resendVerificationPrompt.selectedChannel,
                verificationSentToContact: nextContact,
              }
            : u,
        ),
      );
      setSnackbarMessage("Successfully Saved");
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
    }
    setConfirmAction(null);
    setResendVerificationPrompt(null);
  };

  const handleSaveRole = () => {
    if (!selectedUser) {
      return;
    }

    if (!pendingRole) {
      setPendingRoleError("Role cannot be empty.");
      return;
    }

    const nextAssignment: RoleAssignment = {
      id: `${selectedUser.id}-${pendingRole.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      label: pendingRole,
      scope: pendingCompany || "No company selected",
    };

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              assignments: [nextAssignment, ...user.assignments],
            }
          : user,
      ),
    );

    resetAddRoleForm();
  };

  const addPanelRoleRow = () => {
    setPanelRoleRows((rows) => [...rows, { id: `row-${Date.now()}`, company: "", role: "" }]);
  };

  const updatePanelRoleRow = (id: string, field: "company" | "role", value: string) => {
    setPanelRoleRows((rows) =>
      rows.map((row) => {
        if (row.id !== id) return row;
        if (field === "company") return { ...row, company: value, role: "" };
        return { ...row, [field]: value };
      }),
    );
    setPanelRoleRowErrors((current) => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const removePanelRoleRow = (id: string) => {
    setPanelRoleRows((rows) => rows.filter((row) => row.id !== id));
    setPanelRoleRowErrors((current) => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const executeSavePanelEdit = () => {
    if (!selectedUser) return;
    const nextName = panelName.trim() || selectedUser.name;
    setUsers((current) =>
      current.map((u) => {
        if (u.id !== selectedUser.id) return u;
        return {
          ...u,
          name: nextName,
          initials: toInitials(nextName),
          jobTitle: panelJobTitle.trim(),
          email: panelEmail.trim() || "-",
          whatsapp: panelPhone.trim() ? panelPhoneCountryCode + panelPhone.trim() : "-",
          assignments: panelRoleRows
            .filter((r) => r.role)
            .map((r) => ({ id: r.id, label: r.role, scope: r.company || "No company selected" })),
        };
      }),
    );
    setPanelJobTitleError("");
    setPanelContactError(false);
    setSnackbarMessage("Successfully Saved");
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const handleSavePanelEdit = () => {
    if (!selectedUser) return;

    let hasError = false;
    const nextRoleRowErrors: Record<string, PanelRoleRowError> = {};
    if (!panelJobTitle.trim()) {
      setPanelJobTitleError("Field cannot be empty");
      hasError = true;
    } else {
      setPanelJobTitleError("");
    }
    if (!panelEmail.trim() && !panelPhone.trim()) {
      setPanelContactError(true);
      hasError = true;
    } else {
      setPanelContactError(false);
    }
    panelRoleRows.forEach((row) => {
      const company = row.company.trim();
      const role = row.role.trim();
      const wasExistingAssignment = selectedUser.assignments.some((assignment) => assignment.id === row.id);
      const isBlank = !company && !role;

      if (company && !role) {
        nextRoleRowErrors[row.id] = {
          ...(nextRoleRowErrors[row.id] ?? {}),
          role: "Field cannot be empty",
        };
        hasError = true;
      }

      if (!company && role) {
        nextRoleRowErrors[row.id] = {
          ...(nextRoleRowErrors[row.id] ?? {}),
          company: "Field cannot be empty",
        };
        hasError = true;
      }

      if (wasExistingAssignment && isBlank) {
        nextRoleRowErrors[row.id] = {
          company: "Field cannot be empty",
          role: "Field cannot be empty",
        };
        hasError = true;
      }
    });
    setPanelRoleRowErrors(nextRoleRowErrors);
    if (hasError) return;

    const originalEmail = selectedUser.email === "-" ? "" : selectedUser.email;
    const originalPhone = selectedUser.whatsapp === "-" ? "" : selectedUser.whatsapp;
    const nextEmail = panelEmail.trim();
    const nextPhone = panelPhone.trim() ? panelPhoneCountryCode + panelPhone.trim() : "";
    const contactChanged = panelEmail.trim() !== originalEmail || nextPhone !== originalPhone;
    const emailChanged = nextEmail !== originalEmail;
    const phoneChanged = nextPhone !== originalPhone;
    const nextResendChannel: "email" | "whatsapp" =
      phoneChanged && nextPhone ? "whatsapp" : emailChanged && nextEmail ? "email" : savedVerificationChannel || "email";
    const shouldPromptVerificationResend =
      selectedUser.status === "waiting" && savedVerificationContact !== "" && (emailChanged || phoneChanged);

    setResendVerificationPrompt(
      shouldPromptVerificationResend
        ? {
            selectedChannel: nextResendChannel,
            emailContact: nextEmail,
            whatsappContact: nextPhone,
          }
        : null,
    );

    if (contactChanged) {
      setShowPinModal(true);
      switchToOtpMode("contact-save");
    } else {
      executeSavePanelEdit();
    }
  };

  const confirmPinAndSave = () => {
    if (isPinCurrentlyBlocked()) {
      setPinError(`PIN blocked. Try again in ${formatPinBlockRemaining(pinBlockedUntil! - Date.now())}.`);
      return;
    }
    if (pinValue.length < 6) {
      setPinError("Please enter your 6-digit PIN.");
      return;
    }
    if (pinValue !== "000000") {
      recordPinFailure(setPinError);
      return;
    }
    setPinAttempts(0);
    setPinBlockedUntil(null);
    setShowPinModal(false);
    setPinValue("");
    setPinError("");
    setPinVisible(false);
    executeSavePanelEdit();
    if (resendVerificationPrompt) {
      setConfirmAction("resend-verification");
    }
  };

  const executeCreateUser = () => {
    const normalizedNewPhone = newUserForm.phoneNumber.trim().replace(/\D/g, "");
    const fullNewPhone = normalizedNewPhone ? `${newUserPhoneCountryCode}${normalizedNewPhone}` : "";
    const firstRole = newUserRoles[0];
    const nextName = newUserForm.name.trim();
    const createdUser: UserRecord = {
      id: toUserId(nextName),
      userId: generateUserId(users.map((u) => u.userId)),
      name: nextName,
      initials: toInitials(nextName),
      email: newUserForm.email.trim() || "-",
      whatsapp: fullNewPhone || "-",
      jobTitle: newUserForm.jobTitle.trim(),
      status: "waiting",
      company: firstRole?.company || "No company selected",
      parentCompany: "",
      role: firstRole?.role || "",
      assignments: newUserRoles
        .filter((r) => r.role)
        .map((r) => ({
          id: `assignment-${r.id}-${Date.now()}`,
          label: r.role,
          scope: r.company || "No company selected",
        })),
      verificationSentTo: verificationChannel,
      verificationSentToContact:
        verificationChannel === "email"
          ? newUserForm.email.trim()
          : verificationChannel === "whatsapp"
            ? fullNewPhone
            : "",
    };
    setUsers((currentUsers) => [createdUser, ...currentUsers]);
    setSelectedUserId(createdUser.id);
    setDetailVisible(true);
    setRoleFilters([]);
    setCompanyFilters([]);
    setSearchQuery("");
    resetNewUserForm();
    setSnackbarMessage("Invitation sent successfully");
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const handleCreateUser = () => {
    let hasError = false;
    const normalizedNewPhone = newUserForm.phoneNumber.trim().replace(/\D/g, "");

    if (!newUserForm.name.trim()) {
      setNewUserNameError("Full name is required.");
      hasError = true;
    } else {
      setNewUserNameError("");
    }

    if (!newUserForm.jobTitle.trim()) {
      setNewUserJobTitleError("Job title is required.");
      hasError = true;
    } else {
      setNewUserJobTitleError("");
    }

    const hasEmail = newUserForm.email.trim();
    const hasPhone = normalizedNewPhone;
    if (!hasEmail && !hasPhone) {
      setNewUserContactError("At least one contact (Email or WhatsApp) is required.");
      hasError = true;
    } else if (hasEmail && hasPhone && !verificationChannel) {
      setNewUserContactError("Please select a verification method.");
      hasError = true;
    } else {
      setNewUserContactError("");
    }

    const firstRole = newUserRoles[0];
    if (!firstRole || !firstRole.role) {
      setNewUserRoleError("Role cannot be empty.");
      hasError = true;
    } else {
      setNewUserRoleError("");
    }

    if (hasError) return;
    openActionPinModal("invite-user");
  };

  useEffect(() => {
    resetAddRoleForm();
    cancelInlineEdit();
    const user = users.find((u) => u.id === selectedUserId);
    if (user) {
      setPanelName(user.name);
      setNameError("");
      setPanelJobTitle(user.jobTitle || "");
      setPanelEmail(user.email === "-" ? "" : user.email);
      const savedPhone = user.whatsapp === "-" ? "" : user.whatsapp;
      const parsedPhone = savedPhone ? splitPhoneNumber(savedPhone) : { countryCode: "+62", phone: "" };
      setPanelPhone(parsedPhone.phone);
      setPanelPhoneCountryCode(parsedPhone.countryCode);
      setPanelRoleRows(
        user.assignments.length > 0
          ? user.assignments.map((a) => ({ id: a.id, company: a.scope, role: a.label }))
          : [{ id: "row-init", company: "", role: "" }],
      );
      setPanelJobTitleError("");
      setPanelContactError(false);
      setPanelLastRegeneratedPin(user.lastRegeneratedPin);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (activeScreen === "user-management") {
      setNameError("");
    }
  }, [activeScreen]);

  useEffect(() => {
    if (!otpTimerActive || otpTimer <= 0) {
      if (otpTimer <= 0) setOtpTimerActive(false);
      return;
    }
    const id = setTimeout(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [otpTimerActive, otpTimer]);

  useEffect(() => {
    if (!pinBlockedUntil) return;
    const remaining = pinBlockedUntil - Date.now();
    if (remaining <= 0) { setPinBlockedUntil(null); return; }
    const id = setTimeout(() => setPinBlockTick((t) => t + 1), 1000);
    return () => clearTimeout(id);
  }, [pinBlockedUntil, pinBlockTick]);

  const pinIsBlocked = !!(pinBlockedUntil && Date.now() < pinBlockedUntil);
  const pinBlockRemaining = pinIsBlocked ? pinBlockedUntil! - Date.now() : 0;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <div className={styles.brandMark}>
            <AppGridIcon className={styles.brandMarkIcon} />
          </div>
          <div>
            <div className={styles.brandName}>labamu</div>
            <div className={styles.brandTagline}>&amp; Growth Simplified</div>
          </div>
        </div>

        <div className={styles.holdingSection}>
          <span className={styles.sidebarCaption}>Holding</span>
          <label className={styles.holdingSelect}>
            <span className={styles.visuallyHidden}>Holding</span>
            <select defaultValue="Sogo Indo Indonesia" className={styles.holdingNativeSelect}>
              <option>Sogo Indo Indonesia</option>
            </select>
            <ChevronDownIcon className={styles.holdingChevron} />
          </label>
        </div>

        <nav className={styles.sidebarNav} aria-label="User management navigation">
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={item.id === activeScreen}
              onClick={() => {
                if (item.id === "user-management" || item.id === "role-access") {
                  requestScreenChange(item.id as ActiveScreen);
                }
              }}
            />
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.sidebarFooterAvatar}>SH</div>
          <div>
            <div className={styles.sidebarFooterName}>Sogo Halo Owner</div>
            <div className={styles.sidebarFooterRole}>Super Admin</div>
          </div>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <div className={styles.topbarActions}>
            <button type="button" className={styles.iconGhostButton} aria-label="Notifications">
              <BellIcon className={styles.topbarBell} />
            </button>
            <button type="button" className={styles.profileButton}>
              <span className={styles.profileAvatar}>SH</span>
              <span className={styles.profileMeta}>
                <strong className={styles.profileName}>Sogo Halo Owner</strong>
                <span className={styles.profileRole}>Super Admin</span>
              </span>
              <ChevronDownIcon className={styles.profileChevron} />
            </button>
          </div>
        </header>

        {activeScreen === "role-access" ? (() => {
          const sortedRoles = [...roles.filter((r) => !r.isPredefined), ...roles.filter((r) => r.isPredefined)];
          const filteredRolesList = roleSearchQuery.trim()
            ? sortedRoles.filter((r) =>
                r.name.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
                r.description.toLowerCase().includes(roleSearchQuery.toLowerCase()),
              )
            : sortedRoles;
          const roleTotalPages = Math.max(1, Math.ceil(filteredRolesList.length / rolePageSize));
          const safePage = Math.min(rolePage, roleTotalPages);
          const paginatedRoles = filteredRolesList.slice((safePage - 1) * rolePageSize, safePage * rolePageSize);

          return (
            <div className={cx(styles.contentGrid, permConfigRole !== null && styles.contentGridWithDetail)}>
              <main className={styles.mainContent}>
                <div className={styles.pageHeader}>
                  <div className={styles.pageHeaderInfo}>
                    <h2 className={styles.pageTitle}>Role Access</h2>
                    <nav className={styles.pageBreadcrumb} aria-label="Breadcrumb">
                      <span className={styles.pageBreadcrumbItem}>Dashboard</span>
                      <span className={styles.pageBreadcrumbSep} aria-hidden="true">/</span>
                      <span className={styles.pageBreadcrumbCurrent}>Role Access</span>
                    </nav>
                  </div>
                  <button type="button" className={cx(styles.primaryButton, styles.primaryButtonSmall)} onClick={openAddRole}>
                    <PlusIcon className={styles.buttonIcon} />
                    <span>Add Role</span>
                  </button>
                </div>

                <section className={styles.roleSection}>
                  <div className={styles.roleTableCard}>
                    <div className={styles.roleTableToolbar}>
                      <div className={styles.roleTableCounter}>
                        <strong className={styles.roleTableCountNum}>{roles.length}</strong>
                        <span> Roles</span>
                      </div>
                      <label className={styles.searchField}>
                        <SearchIcon className={styles.searchFieldIcon} />
                        <span className={styles.visuallyHidden}>Search roles</span>
                        <input
                          type="search"
                          placeholder="Search role, description"
                          value={roleSearchQuery}
                          onChange={(e) => { setRoleSearchQuery(e.target.value); setRolePage(1); }}
                          className={styles.searchFieldInput}
                        />
                      </label>
                    </div>

                    <div className={styles.roleTableHeader}>
                      <span>Role</span>
                      <span>Members</span>
                      <span className={styles.roleTableHeaderEdit}>Edit</span>
                    </div>

                    {paginatedRoles.length === 0 ? (
                      <div className={styles.emptyState}>
                        <img
                          src="https://www.figma.com/api/mcp/asset/da9abaf4-1b6a-4e28-ba03-476ababaca96"
                          alt=""
                          className={styles.emptyStateImage}
                        />
                        <div className={styles.emptyStateText}>
                          <p className={styles.emptyStateTitle}>No results found</p>
                          <p className={styles.emptyStateCaption}>Try adjusting your search term</p>
                        </div>
                      </div>
                    ) : null}

                    {paginatedRoles.map((role) => {
                      const counts = buildPermCounts(role.permissions);
                      return (
                        <div key={role.id} className={cx(styles.roleTableRow, styles.roleTableRowClickable, permConfigRole?.id === role.id && styles.roleTableRowSelected)} onClick={() => openPermConfig(role)}>
                          <div className={styles.roleNameCell}>
                            <div className={styles.roleNameRow}>
                              <span className={styles.roleNameText}>{role.name}</span>
                              {role.isPredefined ? <span className={styles.predefinedBadge}>System</span> : null}
                            </div>
                            {role.description ? <span className={styles.roleDescCell}>{role.description}</span> : null}
                          </div>
                          <span className={styles.roleMemberCount}>{role.userCount} member{role.userCount !== 1 ? "s" : ""}</span>
                          <div className={styles.roleRowActions} onClick={(e) => e.stopPropagation()}>
                            <button type="button" className={styles.roleEditButton} onClick={() => openPermConfig(role)} aria-label={`Edit ${role.name}`}>
                              <PencilIcon className={styles.roleEditIcon} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <div className={styles.roleTableFooter}>
                      <div className={styles.tableFooterLeft}>
                        <label className={styles.pageSizeSelect}>
                          <span className={styles.visuallyHidden}>Rows per page</span>
                          <select
                            value={String(rolePageSize)}
                            onChange={(e) => { setRolePageSize(Number(e.target.value)); setRolePage(1); }}
                            className={styles.pageSizeNativeSelect}
                          >
                            {["10", "25", "50"].map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                          <ChevronDownIcon className={styles.pageSizeChevron} />
                        </label>
                        <span className={styles.tableFooterCaption}>from {filteredRolesList.length} rows</span>
                      </div>
                      <div className={styles.pagination}>
                        <button type="button" className={cx(styles.paginationButton, styles.paginationButtonMuted)} aria-label="Previous page" onClick={() => setRolePage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}>
                          <ChevronRightIcon className={styles.paginationIconPrevious} />
                        </button>
                        {Array.from({ length: roleTotalPages }, (_, i) => i + 1).map((p) => (
                          <button key={p} type="button" className={cx(styles.paginationButton, p === safePage ? styles.paginationButtonActive : styles.paginationButtonMuted)} aria-current={p === safePage ? "page" : undefined} onClick={() => setRolePage(p)}>
                            {p}
                          </button>
                        ))}
                        <button type="button" className={cx(styles.paginationButton, styles.paginationButtonMuted)} aria-label="Next page" onClick={() => setRolePage((p) => Math.min(roleTotalPages, p + 1))} disabled={safePage >= roleTotalPages}>
                          <ChevronRightIcon className={styles.paginationIconNext} />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </main>

              {permConfigRole !== null ? (
                <aside className={styles.detailPanel}>
                  <div className={styles.permPanelHeader}>
                    <div className={styles.permPanelHeaderLeft}>
                      <p className={styles.panelLabel}>{isNewRole ? "New Role" : "Edit Role"}</p>
                      {!isNewRole ? (
                        <div className={styles.roleNameTitleArea}>
                          {permConfigRole.isPredefined ? (
                            <span className={styles.editUserNameText}>{editingRoleName}</span>
                          ) : (
                            <TextField
                              value={editingRoleName}
                              onChange={(e) => { setEditingRoleName(e.target.value); if (e.target.value.trim()) setRoleNameError(""); }}
                              onBlur={() => { if (!editingRoleName.trim()) setRoleNameError("Field cannot be empty."); else setRoleNameError(""); }}
                              errorText={roleNameError}
                              inlineEditable
                              inlinePlaceholder="Enter role name"
                              variant="outlined"
                            />
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className={styles.permPanelHeaderActions}>
                      <button type="button" className={styles.closeButton} onClick={closePermConfig} aria-label="Close">
                        <CloseIcon className={styles.closeIcon} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.permPanelNewRoleFields}>
                    {isNewRole ? (
                      <div className={styles.inviteFieldGroup}>
                        <TextField
                          value={editingRoleName}
                          onChange={(e) => { setEditingRoleName(e.target.value); if (e.target.value.trim()) setRoleNameError(""); }}
                          errorText={roleNameError}
                          placeholder="Enter role name"
                          autoFocus
                        />
                      </div>
                    ) : null}
                    <div className={styles.inviteFieldGroup}>
                      <label className={styles.inviteFieldLabel} htmlFor="role-desc-input">Description</label>
                      <input
                        id="role-desc-input"
                        type="text"
                        value={editingRoleDesc}
                        onChange={(e) => setEditingRoleDesc(e.target.value)}
                        disabled={permConfigRole.isPredefined}
                        className={cx(styles.inviteFieldInput, permConfigRole.isPredefined ? styles.inviteFieldInputDisabled : undefined)}
                        placeholder="Enter description (optional)"
                      />
                    </div>
                  </div>

                  <div className={styles.permConfigTableHeader}>
                    <span>Module</span>
                    <span>Access Level</span>
                  </div>

                  <div className={styles.permConfigSection}>
                    <div className={styles.permConfigRow}>
                      <div className={styles.permConfigModuleName}>
                        <UsersIcon className={styles.permConfigModuleIcon} />
                        <span>User Management</span>
                      </div>
                      <AccessSelect
                        value={editingPerms.userManagement.level}
                        disabled={permConfigRole.isPredefined}
                        onChange={(level) => setEditingPerms((p) => ({ ...p, userManagement: { ...p.userManagement, level, ...(level !== "full-access" && { canSuspend: false, canAssignToCompanies: false, canRegeneratePin: false }) } }))}
                      />
                    </div>
                    {editingPerms.userManagement.level === "full-access" ? (
                      <div className={styles.permConfigExtras}>
                        <label className={styles.permConfigToggle}>
                          <input type="checkbox" checked={editingPerms.userManagement.canSuspend} disabled={permConfigRole.isPredefined} onChange={(e) => setEditingPerms((p) => ({ ...p, userManagement: { ...p.userManagement, canSuspend: e.target.checked } }))} className={styles.permConfigCheckbox} />
                          <span>Suspend users</span>
                        </label>
                        <label className={styles.permConfigToggle}>
                          <input type="checkbox" checked={editingPerms.userManagement.canAssignToCompanies} disabled={permConfigRole.isPredefined} onChange={(e) => setEditingPerms((p) => ({ ...p, userManagement: { ...p.userManagement, canAssignToCompanies: e.target.checked } }))} className={styles.permConfigCheckbox} />
                          <span>Assign users to other companies</span>
                        </label>
                        <label className={styles.permConfigToggle}>
                          <input type="checkbox" checked={editingPerms.userManagement.canRegeneratePin} disabled={permConfigRole.isPredefined} onChange={(e) => setEditingPerms((p) => ({ ...p, userManagement: { ...p.userManagement, canRegeneratePin: e.target.checked } }))} className={styles.permConfigCheckbox} />
                          <span>Regenerate PIN</span>
                        </label>
                      </div>
                    ) : null}
                  </div>

                  <div className={styles.permConfigSection}>
                    <div className={styles.permConfigRow}>
                      <div className={styles.permConfigModuleName}>
                        <ShieldIcon className={styles.permConfigModuleIcon} />
                        <span>Role Management</span>
                      </div>
                      <AccessSelect
                        value={editingPerms.roleManagement.level}
                        disabled={permConfigRole.isPredefined}
                        onChange={(level) => setEditingPerms((p) => ({ ...p, roleManagement: { level } }))}
                      />
                    </div>
                  </div>

                  <div className={styles.permConfigSection}>
                    <div className={styles.permConfigRow}>
                      <div className={styles.permConfigModuleName}>
                        <BriefcaseIcon className={styles.permConfigModuleIcon} />
                        <span>Entity Management</span>
                      </div>
                      <AccessSelect
                        value={editingPerms.entityManagement.level}
                        disabled={permConfigRole.isPredefined}
                        onChange={(level) => setEditingPerms((p) => ({ ...p, entityManagement: { ...p.entityManagement, level, ...(level !== "full-access" && { canSuspend: false }) } }))}
                      />
                    </div>
                    {editingPerms.entityManagement.level === "full-access" ? (
                      <div className={styles.permConfigExtras}>
                        <label className={styles.permConfigToggle}>
                          <input type="checkbox" checked={editingPerms.entityManagement.canSuspend} disabled={permConfigRole.isPredefined} onChange={(e) => setEditingPerms((p) => ({ ...p, entityManagement: { ...p.entityManagement, canSuspend: e.target.checked } }))} className={styles.permConfigCheckbox} />
                          <span>Suspend entities</span>
                        </label>
                      </div>
                    ) : null}
                  </div>

                  <div className={styles.rolePanelStickyFooter}>
                    {!isNewRole ? (
                      <button
                        type="button"
                        className={cx(styles.rolePanelDuplicateBtn, permConfigRole.isPredefined && styles.rolePanelDuplicateBtnPredefined)}
                        onClick={() => duplicateRole(permConfigRole)}
                        aria-label="Duplicate role"
                      >
                        <CopyIcon className={styles.buttonIcon} />
                        {permConfigRole.isPredefined && <span>Duplicate Role</span>}
                      </button>
                    ) : null}
                    {!isNewRole && !permConfigRole.isPredefined ? (
                      <button type="button" className={styles.dangerGhostButton} onClick={() => deleteRole(permConfigRole.id)}>
                        <TrashIcon className={styles.buttonIcon} />
                        <span>Delete</span>
                      </button>
                    ) : null}
                    {!permConfigRole.isPredefined ? (
                      <MainBtn
                        variant="primary"
                        size="lg"
                        className={styles.rolePanelSaveBtn}
                        onClick={savePermConfig}
                        disabled={isRoleAccessSaveDisabled}
                        label={isNewRole ? "Create Role" : "Save Changes"}
                      />
                    ) : null}
                  </div>
                </aside>
              ) : null}
            </div>
          );
        })() : (
        <div className={cx(styles.contentGrid, (detailVisible || isNewUserOpen) && styles.contentGridWithDetail)}>
          <main className={styles.mainContent}>
            <div className={styles.pageHeader}>
              <div className={styles.pageHeaderInfo}>
                <h2 className={styles.pageTitle}>User Management</h2>
                <nav className={styles.pageBreadcrumb} aria-label="Breadcrumb">
                  <span className={styles.pageBreadcrumbItem}>Dashboard</span>
                  <span className={styles.pageBreadcrumbSep} aria-hidden="true">/</span>
                  <span className={styles.pageBreadcrumbCurrent}>User Management</span>
                </nav>
              </div>
              <button type="button" className={cx(styles.primaryButton, styles.primaryButtonSmall)} onClick={() => requestPanelAction({ type: "open-new-user" })}>
                <PlusIcon className={styles.buttonIcon} />
                <span>New User</span>
              </button>
            </div>

            <section className={styles.metricsGrid} aria-label="User summary">
              <MetricCard
                label="Invited"
                value={invitedUsers}
                status="waiting"
                selected={statusFilters.includes("waiting")}
                onClick={() => toggleStatusFilter("waiting")}
              />
              <MetricCard
                label="Active"
                value={activeUsers}
                status="active"
                selected={statusFilters.includes("active")}
                onClick={() => toggleStatusFilter("active")}
              />
              <MetricCard
                label="Locked"
                value={lockedUsers}
                status="locked"
                selected={statusFilters.includes("locked")}
                onClick={() => toggleStatusFilter("locked")}
              />
            </section>

            <section className={styles.tableCard}>
              <div className={styles.tableToolbar}>
                <div className={styles.tableToolbarStart}>
                  <div className={styles.slotSummary}>
                    <strong className={styles.slotSummaryCount}>{totalUsers}</strong>
                    <span>/100 Slot</span>
                  </div>
                  <span className={styles.slotSummaryDivider} aria-hidden="true">
                    |
                  </span>
                  <div className={styles.tableFilters}>
                    {filterMenus.map((filterMenu) => (
                      <FilterPill
                        key={filterMenu.id}
                        label={filterMenu.label}
                        multiple
                        values={filterMenu.selectedValues}
                        options={filterMenu.options}
                        onChangeMultiple={filterMenu.onChangeMultiple}
                      />
                    ))}
                  </div>
                </div>

                <label className={styles.searchField}>
                  <SearchIcon className={styles.searchFieldIcon} />
                  <span className={styles.visuallyHidden}>Search users</span>
                  <input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className={styles.searchFieldInput}
                  />
                </label>
              </div>

              <div className={styles.tableHeader} role="row">
                <span>User ID</span>
                <span className={styles.tableColumnName}>Name</span>
                <span>Job Title</span>
                <span>Status</span>
                <div className={styles.tableActionsHeader} role="presentation">
                  <span className={styles.tableActionHeaderCell}>Email</span>
                  <span className={styles.tableActionHeaderCell}>Chat</span>
                </div>
              </div>

              <div className={styles.tableBody}>
                {filteredUsers.length === 0 ? (
                  <div className={styles.emptyState}>
                    <img
                      src="https://www.figma.com/api/mcp/asset/da9abaf4-1b6a-4e28-ba03-476ababaca96"
                      alt=""
                      className={styles.emptyStateImage}
                    />
                    <div className={styles.emptyStateText}>
                      <p className={styles.emptyStateTitle}>No results found</p>
                      <p className={styles.emptyStateCaption}>Try adjusting your filters or search term</p>
                    </div>
                  </div>
                ) : null}
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    role="row"
                    tabIndex={0}
                    className={cx(styles.tableRow, selectedUser.id === user.id && styles.tableRowSelected)}
                    onClick={() => {
                      if (user.id === selectedUserId && detailVisible) return;
                      requestPanelAction({ type: "select-user", userId: user.id });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (user.id === selectedUserId && detailVisible) return;
                        requestPanelAction({ type: "select-user", userId: user.id });
                      }
                    }}
                  >
                    <span className={styles.tableUserId}>{user.userId}</span>
                    <span className={styles.tableUserName}>{user.name}</span>
                    <span className={styles.tableJobTitle}>{user.jobTitle || "-"}</span>
                    <StatusCell status={user.status} />
                    <span className={styles.tableActions}>
                      <IconBtn
                        variant="secondary"
                        size="md"
                        icon={<MailIcon className={styles.actionIcon} />}
                        aria-label={`Email ${user.name}`}
                        disabled={user.email === "-"}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <IconBtn
                        variant="secondary"
                        size="md"
                        icon={<MessageIcon className={styles.actionIcon} />}
                        aria-label={`Message ${user.name}`}
                        disabled={user.whatsapp === "-"}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.tableFooter}>
                <div className={styles.tableFooterLeft}>
                  <label className={styles.pageSizeSelect}>
                    <span className={styles.visuallyHidden}>Rows per page</span>
                    <select value={pageSize} onChange={(event) => setPageSize(event.target.value)} className={styles.pageSizeNativeSelect}>
                      {PAGE_SIZE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className={styles.pageSizeChevron} />
                  </label>
                  <span className={styles.tableFooterCaption}>from {filteredUsers.length} rows</span>
                </div>

                <div className={styles.pagination}>
                  <button type="button" className={cx(styles.paginationButton, styles.paginationButtonMuted)} aria-label="Previous page">
                    <ChevronRightIcon className={styles.paginationIconPrevious} />
                  </button>
                  <button type="button" className={cx(styles.paginationButton, styles.paginationButtonActive)} aria-current="page">
                    1
                  </button>
                  <button type="button" className={cx(styles.paginationButton, styles.paginationButtonMuted)} aria-label="Next page">
                    <ChevronRightIcon className={styles.paginationIconNext} />
                  </button>
                </div>
              </div>
            </section>
          </main>

          {detailVisible ? (
            <aside className={styles.detailPanel}>
              {/* Header */}
              <div className={styles.detailPanelHeader}>
                <PanelLabel>Edit User</PanelLabel>
                <button
                  type="button"
                  className={styles.closeButton}
                  aria-label="Close detail panel"
                  onClick={() => requestPanelAction({ type: "close-panel" })}
                >
                  <CloseIcon className={styles.closeIcon} />
                </button>
              </div>

              {/* Hero: editable name + email/chat buttons + status */}
              <div className={styles.editUserHero}>
                <div className={styles.editUserNameRow}>
                  <div className={styles.editUserNameWrap}>
                    <TextField
                      value={panelName}
                      onChange={(e) => { setPanelName(e.target.value); if (e.target.value.trim()) setNameError(""); }}
                      onBlur={() => { if (!panelName.trim()) setNameError("Field cannot be empty."); else setNameError(""); }}
                      errorText={nameError}
                      inlineEditable
                      inlinePlaceholder="Enter name"
                      variant="outlined"
                      className="!bg-white"
                    />
                  </div>
                  <div className={styles.editUserNameBtns}>
                    <IconBtn
                      variant="secondary"
                      size="md"
                      icon={<MailIcon className={styles.actionIcon} />}
                      aria-label={`Email ${selectedUser.name}`}
                      disabled={savedEmail === "-" || savedEmail.trim() === ""}
                      onClick={() =>
                        savedEmail !== "-" &&
                        savedEmail.trim() !== "" &&
                        requestPanelAction({ type: "external-link", href: `mailto:${savedEmail}`, target: "_self" })
                      }
                    />
                    <IconBtn
                      variant="secondary"
                      size="md"
                      icon={<MessageIcon className={styles.actionIcon} />}
                      aria-label={`Message ${selectedUser.name}`}
                      disabled={savedWhatsapp === "-" || savedWhatsapp.trim() === ""}
                      onClick={() => {
                        const href = toWhatsAppHref(savedWhatsapp);
                        if (href) requestPanelAction({ type: "external-link", href, target: "_blank" });
                      }}
                    />
                  </div>
                </div>
                <StatusCell status={selectedUser.status} />
              </div>

              {/* Body */}
              <div className={styles.detailPanelBody}>
                {/* INFO section */}
                <section className={styles.editSection}>
                  <PanelLabel>Info</PanelLabel>
                  <div className={styles.editFieldGroup}>
                    <label className={styles.editFieldLabel} htmlFor="edit-job-title">
                      <span className={styles.requiredStar}>*</span> Job Title
                    </label>
                    <input
                      id="edit-job-title"
                      type="text"
                      value={panelJobTitle}
                      onChange={(e) => { setPanelJobTitle(e.target.value); if (e.target.value.trim()) setPanelJobTitleError(""); }}
                      className={cx(styles.editFieldInput, panelJobTitleError ? styles.editFieldInputError : undefined)}
                      placeholder="Enter job title"
                    />
                    {panelJobTitleError ? <span className={styles.fieldError}>{panelJobTitleError}</span> : null}
                  </div>
                  <div className={styles.editFieldGroup}>
                    <span className={styles.editFieldLabel}>
                      <span className={styles.requiredStar}>*</span> Contact{" "}
                      <span className={cx(styles.editFieldHint, panelContactError && styles.editFieldHintError)}>
                        (Fill at least 1)
                      </span>
                    </span>
                    <div className={styles.editContactRow}>
                      <input
                        type="email"
                        value={panelEmail}
                        onChange={(e) => { setPanelEmail(e.target.value); if (e.target.value.trim() || panelPhone.trim()) setPanelContactError(false); }}
                        className={styles.editFieldInput}
                        placeholder="Email address"
                      />
                      <PhoneField
                        code={panelPhoneCountryCode}
                        phone={panelPhone}
                        onCodeChange={setPanelPhoneCountryCode}
                        onPhoneChange={(v) => {
                          setPanelPhone(v);
                          if (v.trim() || panelEmail.trim()) setPanelContactError(false);
                        }}
                        phonePlaceholder="Phone number"
                      />
                    </div>
                    {selectedUser.status === "waiting" && savedVerificationChannel && savedVerificationContact ? (
                      <div className={styles.verificationInfoBox}>
                        <div className={styles.verificationInfoText}>
                          <span className={styles.verificationInfoLabel}>Verification link sent to</span>
                          <span className={styles.verificationInfoValue}>
                            {savedVerificationChannel === "email" ? "Email" : "WhatsApp"}: {savedVerificationContact}
                          </span>
                        </div>
                        <MainBtn variant="secondary" size="sm" onClick={openResendVerificationPrompt} label="Resend Verification" />
                      </div>
                    ) : null}
                    <div className={styles.editFieldGroup}>
                      <label className={styles.editFieldLabel} htmlFor="edit-user-id">
                        User ID
                      </label>
                      <input
                        id="edit-user-id"
                        type="text"
                        value={selectedUser.userId}
                        disabled
                        className={cx(styles.editFieldInput, styles.inviteFieldInputDisabled)}
                      />
                    </div>
                  </div>
                </section>

                {/* ROLE ASSIGNMENT section */}
                <section className={styles.editSection}>
                  <div className={styles.editSectionHeader}>
                    <PanelLabel>Role Assignment</PanelLabel>
                    <MainBtn
                      variant="secondary"
                      size="sm"
                      leftIcon={<PlusIcon className={styles.buttonIcon} />}
                      onClick={addPanelRoleRow}
                      label="Add"
                    />
                  </div>
                  <div className={styles.editRoleList}>
                    {panelRoleRows.map((row) => (
                      <div key={row.id} className={cx(styles.editRoleRow, panelRoleRows.length === 1 && styles.editRoleRowSingle)}>
                        <label className={styles.editRoleField}>
                          <span className={styles.editFieldLabel}>
                            <span className={styles.requiredStar}>*</span> Entity
                          </span>
                          <div className={cx(styles.roleFormControl, panelRoleRowErrors[row.id]?.company && styles.roleFormControlError)}>
                            <select
                              value={row.company}
                              onChange={(e) => updatePanelRoleRow(row.id, "company", e.target.value)}
                              className={cx(styles.roleFormSelect, panelRoleRowErrors[row.id]?.company && styles.roleFormSelectError)}
                            >
                              {COMPANY_ASSIGNMENT_OPTIONS.map((opt) => (
                                <option key={opt.value || "ph-co"} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDownIcon className={styles.roleFormChevron} />
                          </div>
                          {panelRoleRowErrors[row.id]?.company ? (
                            <span className={styles.roleFormError}>{panelRoleRowErrors[row.id]?.company}</span>
                          ) : null}
                        </label>
                        <label className={styles.editRoleField}>
                          <span className={styles.editFieldLabel}>
                            <span className={styles.requiredStar}>*</span> Role
                          </span>
                          <div className={cx(styles.roleFormControl, panelRoleRowErrors[row.id]?.role && styles.roleFormControlError)}>
                            <select
                              value={row.role}
                              disabled={!row.company}
                              onChange={(e) => updatePanelRoleRow(row.id, "role", e.target.value)}
                              className={cx(styles.roleFormSelect, panelRoleRowErrors[row.id]?.role && styles.roleFormSelectError)}
                            >
                              {ROLE_ASSIGNMENT_OPTIONS.map((opt) => (
                                <option key={opt.value || "ph-ro"} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDownIcon className={styles.roleFormChevron} />
                          </div>
                          {panelRoleRowErrors[row.id]?.role ? (
                            <span className={styles.roleFormError}>{panelRoleRowErrors[row.id]?.role}</span>
                          ) : null}
                        </label>
                        {panelRoleRows.length > 1 ? (
                          <button
                            type="button"
                            className={styles.assignmentDeleteButton}
                            aria-label="Remove role"
                            onClick={() => removePanelRoleRow(row.id)}
                          >
                            <TrashIcon className={styles.assignmentDeleteIcon} />
                          </button>
                        ) : (
                          <span className={styles.editRoleDeleteSpacer} aria-hidden="true" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className={styles.editUserFooter}>
                <div className={styles.lastRegeneratedPinRow}>
                  <span className={styles.lastRegeneratedPinLabel}>Last Regenerated PIN</span>
                  <span className={styles.lastRegeneratedPinValue}>{panelLastRegeneratedPin ?? "-"}</span>
                </div>
                <div
                  className={cx(
                    styles.editUserFooterActions,
                  )}
                >
                  <MainBtn variant="secondary" size="lg" className={styles.editUserFooterAction} onClick={openRegeneratePinModal} label="Regenerate PIN" />
                  <MainBtn
                    variant="primary"
                    size="lg"
                    className={styles.editUserFooterAction}
                    onClick={handleSavePanelEdit}
                    disabled={!hasUnsavedPanelChanges}
                    label="Save Changes"
                  />
                  <MainBtn
                    variant="secondary"
                    size="lg"
                    className={`${styles.editUserFooterAction} border-lb-red text-lb-red hover:bg-lb-red-bg`}
                    onClick={() => requestPanelAction({ type: "delete-user" })}
                    leftIcon={<TrashIcon className={styles.buttonIcon} />}
                    disabled={selectedUserId === "sogo-halo-owner"}
                    label="Delete"
                  />
                  <MainBtn
                    variant="secondary"
                    size="lg"
                    className={`${styles.editUserFooterAction} border-lb-red text-lb-red hover:bg-lb-red-bg`}
                    onClick={() =>
                      requestPanelAction(
                        selectedUser.status === "locked" ? { type: "revoke-suspend" } : { type: "suspend-user" },
                      )
                    }
                    leftIcon={<LockIcon className={styles.buttonIcon} />}
                    disabled={selectedUserId === "sogo-halo-owner" || selectedUser.status === "waiting"}
                    label={selectedUser.status === "locked" ? "Unlock" : "Lock"}
                  />
                </div>
              </div>
            </aside>
          ) : null}

          {isNewUserOpen ? (
            <aside className={styles.detailPanel}>
              <div className={styles.permPanelHeader}>
                <div className={styles.permPanelHeaderLeft}>
                  <p className={styles.panelLabel}>New User</p>
                </div>
                <div className={styles.permPanelHeaderActions}>
                  <button type="button" className={styles.closeButton} onClick={resetNewUserForm} aria-label="Close">
                    <CloseIcon className={styles.closeIcon} />
                  </button>
                </div>
              </div>

              <div className={styles.detailPanelBody}>
                {/* INFO section */}
                <section className={styles.editSection}>
                  <PanelLabel>Info</PanelLabel>

                  <div className={styles.editFieldGroup}>
                    <label className={styles.editFieldLabel} htmlFor="panel-invite-name">
                      <span className={styles.requiredStar}>*</span> Full Name
                    </label>
                    <input
                      id="panel-invite-name"
                      type="text"
                      value={newUserForm.name}
                      onChange={(e) => { setNewUserForm((c) => ({ ...c, name: e.target.value })); if (e.target.value.trim()) setNewUserNameError(""); }}
                      className={cx(styles.editFieldInput, newUserNameError ? styles.editFieldInputError : undefined)}
                      placeholder="Enter full name"
                    />
                    {newUserNameError ? <span className={styles.fieldError}>{newUserNameError}</span> : null}
                  </div>

                  <div className={styles.editFieldGroup}>
                    <label className={styles.editFieldLabel} htmlFor="panel-invite-job-title">
                      <span className={styles.requiredStar}>*</span> Job Title
                    </label>
                    <input
                      id="panel-invite-job-title"
                      type="text"
                      value={newUserForm.jobTitle}
                      onChange={(e) => { setNewUserForm((c) => ({ ...c, jobTitle: e.target.value })); if (e.target.value.trim()) setNewUserJobTitleError(""); }}
                      className={cx(styles.editFieldInput, newUserJobTitleError ? styles.editFieldInputError : undefined)}
                      placeholder="Enter job title"
                    />
                    {newUserJobTitleError ? <span className={styles.fieldError}>{newUserJobTitleError}</span> : null}
                  </div>

                  <div className={styles.editFieldGroup}>
                    <span className={styles.editFieldLabel}>
                      <span className={styles.requiredStar}>*</span> Contact{" "}
                      <span className={cx(styles.editFieldHint, newUserContactError ? styles.editFieldHintError : undefined)}>
                        (Fill at least 1)
                      </span>
                    </span>
                    <div className={styles.editContactRow}>
                      <input
                        type="email"
                        value={newUserForm.email}
                        onChange={(e) => {
                          setNewUserForm((c) => ({ ...c, email: e.target.value }));
                          setNewUserContactError("");
                          if (!e.target.value.trim()) setVerificationChannel("");
                        }}
                        className={styles.editFieldInput}
                        placeholder="Email address"
                      />
                      <PhoneField
                        code={newUserPhoneCountryCode}
                        phone={newUserForm.phoneNumber}
                        onCodeChange={setNewUserPhoneCountryCode}
                        onPhoneChange={(v) => {
                          setNewUserForm((c) => ({ ...c, phoneNumber: v }));
                          setNewUserContactError("");
                          if (!v.trim()) setVerificationChannel("");
                        }}
                        phonePlaceholder="Phone number"
                      />
                    </div>
                    {newUserForm.email.trim() && newUserForm.phoneNumber.trim() ? (
                      <div className={styles.inviteVerifySection}>
                        <span className={styles.inviteVerifyLabel}>Send verification to</span>
                        <div className={styles.inviteVerifyOptions}>
                          <label className={styles.inviteVerifyOption}>
                            <input
                              type="radio"
                              name="panelVerificationChannel"
                              value="email"
                              checked={verificationChannel === "email"}
                              onChange={() => { setVerificationChannel("email"); setNewUserContactError(""); }}
                              className={styles.inviteVerifyRadio}
                            />
                            <span>Email</span>
                          </label>
                          <label className={styles.inviteVerifyOption}>
                            <input
                              type="radio"
                              name="panelVerificationChannel"
                              value="whatsapp"
                              checked={verificationChannel === "whatsapp"}
                              onChange={() => { setVerificationChannel("whatsapp"); setNewUserContactError(""); }}
                              className={styles.inviteVerifyRadio}
                            />
                            <span>WhatsApp</span>
                          </label>
                        </div>
                      </div>
                    ) : null}
                    {newUserContactError ? <span className={styles.fieldError}>{newUserContactError}</span> : null}
                  </div>
                </section>

                {/* ROLE ASSIGNMENT section */}
                <section className={styles.editSection}>
                  <div className={styles.editSectionHeader}>
                    <PanelLabel>Role Assignment</PanelLabel>
                    <MainBtn
                      variant="secondary"
                      size="sm"
                      leftIcon={<PlusIcon className={styles.buttonIcon} />}
                      onClick={() => setNewUserRoles((c) => [...c, { id: `role-${Date.now()}`, company: "", role: "" }])}
                      label="Add"
                    />
                  </div>
                  <div className={styles.editRoleList}>
                    {newUserRoles.map((roleEntry, index) => (
                      <div key={roleEntry.id} className={cx(styles.editRoleRow, newUserRoles.length === 1 && styles.editRoleRowSingle)}>
                        <label className={styles.editRoleField}>
                          <span className={styles.editFieldLabel}>
                            <span className={styles.requiredStar}>*</span> Entity
                          </span>
                          <div className={styles.roleFormControl}>
                            <select
                              value={roleEntry.company}
                              onChange={(e) =>
                                setNewUserRoles((c) =>
                                  c.map((r) => r.id === roleEntry.id ? { ...r, company: e.target.value, role: "" } : r)
                                )
                              }
                              className={styles.roleFormSelect}
                            >
                              {COMPANY_ASSIGNMENT_OPTIONS.map((opt) => (
                                <option key={`ni-${roleEntry.id}-co-${opt.value || "ph"}`} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDownIcon className={styles.roleFormChevron} />
                          </div>
                        </label>
                        <label className={styles.editRoleField}>
                          <span className={styles.editFieldLabel}>
                            <span className={styles.requiredStar}>*</span> Role
                          </span>
                          <div className={styles.roleFormControl}>
                            <select
                              value={roleEntry.role}
                              disabled={!roleEntry.company}
                              onChange={(e) => {
                                setNewUserRoles((c) =>
                                  c.map((r) => r.id === roleEntry.id ? { ...r, role: e.target.value } : r)
                                );
                                if (e.target.value) setNewUserRoleError("");
                              }}
                              className={styles.roleFormSelect}
                            >
                              {ROLE_ASSIGNMENT_OPTIONS.map((opt) => (
                                <option key={`ni-${roleEntry.id}-ro-${opt.value || "ph"}`} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDownIcon className={styles.roleFormChevron} />
                          </div>
                          {index === 0 && newUserRoleError ? (
                            <span className={styles.roleFormError}>{newUserRoleError}</span>
                          ) : null}
                        </label>
                        {newUserRoles.length > 1 ? (
                          <button
                            type="button"
                            className={styles.assignmentDeleteButton}
                            aria-label="Remove role"
                            onClick={() => setNewUserRoles((c) => c.filter((r) => r.id !== roleEntry.id))}
                          >
                            <TrashIcon className={styles.assignmentDeleteIcon} />
                          </button>
                        ) : (
                          <span className={styles.editRoleDeleteSpacer} aria-hidden="true" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className={styles.rolePanelStickyFooter}>
                <MainBtn variant="secondary" size="md" className="flex-1" onClick={resetNewUserForm} label="Cancel" />
                <MainBtn variant="primary" size="md" className="flex-1" onClick={handleCreateUser} label="Invite User" />
              </div>
            </aside>
          ) : null}
        </div>
        )}
      </div>



      {confirmAction ? (
        <div
          className={styles.modalBackdrop}
          onClick={() => {
            setConfirmAction(null);
            if (confirmAction === "resend-verification") {
              setResendVerificationPrompt(null);
            }
          }}
        >
          <div className={styles.confirmationPopupCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmationPopupTopRow}>
              <button
                type="button"
                className={styles.confirmationPopupClose}
                onClick={() => {
                  setConfirmAction(null);
                  if (confirmAction === "resend-verification") {
                    setResendVerificationPrompt(null);
                  }
                }}
                aria-label="Close"
              >
                <CloseIcon className={styles.confirmationPopupCloseIcon} />
              </button>
            </div>
            <div className={styles.confirmationPopupBody}>
              {confirmAction === "resend-verification" && resendVerificationPrompt ? (
                <div className={styles.resendVerificationModalContent}>
                  <div className={styles.confirmationPopupContent}>
                    <p className={styles.confirmationPopupTitle}>Resend verification link?</p>
                    <p className={styles.confirmationPopupDesc}>
                      Pick where the new verification link should be sent.
                    </p>
                  </div>
                  <div className={styles.resendVerificationSummary}>
                    {resendVerificationPrompt.emailContact ? (
                      <label
                        className={cx(
                          styles.resendVerificationSummaryItem,
                          resendVerificationPrompt.selectedChannel === "email" &&
                            styles.resendVerificationSummaryItemSelected,
                        )}
                        >
                          <input
                            type="radio"
                            name="resendVerificationTarget"
                            checked={resendVerificationPrompt.selectedChannel === "email"}
                          onChange={() =>
                            setResendVerificationPrompt((current) =>
                              current ? { ...current, selectedChannel: "email" } : current,
                            )
                          }
                          className={styles.resendVerificationRadio}
                        />
                        <span className={styles.resendVerificationSummaryLabel}>Email</span>
                        <span className={styles.resendVerificationSummaryValue}>{resendVerificationPrompt.emailContact}</span>
                      </label>
                    ) : null}
                    {resendVerificationPrompt.whatsappContact ? (
                      <label
                        className={cx(
                          styles.resendVerificationSummaryItem,
                          resendVerificationPrompt.selectedChannel === "whatsapp" &&
                            styles.resendVerificationSummaryItemSelected,
                        )}
                      >
                        <input
                          type="radio"
                          name="resendVerificationTarget"
                          checked={resendVerificationPrompt.selectedChannel === "whatsapp"}
                          onChange={() =>
                            setResendVerificationPrompt((current) =>
                              current ? { ...current, selectedChannel: "whatsapp" } : current,
                            )
                          }
                          className={styles.resendVerificationRadio}
                        />
                        <span className={styles.resendVerificationSummaryLabel}>WhatsApp</span>
                        <span className={styles.resendVerificationSummaryValue}>{resendVerificationPrompt.whatsappContact}</span>
                      </label>
                    ) : null}
                  </div>
                  <div className={styles.confirmationPopupButtons}>
                    <MainBtn
                      variant="secondary"
                      size="lg"
                      className="flex-1"
                      onClick={() => {
                        setConfirmAction(null);
                        setResendVerificationPrompt(null);
                      }}
                      label="Don't resend"
                    />
                    <MainBtn variant="primary" size="lg" className="flex-1" onClick={executeConfirmAction} label="Yes, Resend" />
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.confirmationPopupContent}>
                    <p className={styles.confirmationPopupTitle}>
                      {confirmAction === "delete"
                        ? "Delete this user?"
                        : confirmAction === "suspend"
                          ? "Lock this user?"
                          : "Unlock this user?"}
                    </p>
                    <p className={styles.confirmationPopupDesc}>
                      {confirmAction === "delete"
                        ? "This action cannot be undone. The user will be permanently removed."
                        : confirmAction === "suspend"
                          ? "The user will be locked and lose access until unlocked."
                          : "The user will regain active access to the system."}
                    </p>
                  </div>
                  <div className={styles.confirmationPopupButtons}>
                    <MainBtn variant="secondary" size="md" className="flex-1" onClick={() => setConfirmAction(null)} label="Cancel" />
                    <MainBtn
                      variant="primary"
                      size="md"
                      className="flex-1"
                      onClick={() => {
                        if (confirmAction === "delete") openActionPinModal("delete-user");
                        else if (confirmAction === "suspend") openActionPinModal("lock-user");
                        else if (confirmAction === "revoke-suspend") openActionPinModal("unlock-user");
                      }}
                      label={confirmAction === "delete" ? "Delete" : confirmAction === "suspend" ? "Lock" : "Unlock"}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {pendingPanelAction ? (
        <div className={styles.modalBackdrop} onClick={() => setPendingPanelAction(null)}>
          <div className={styles.confirmationPopupCard} onClick={(event) => event.stopPropagation()}>
            <div className={styles.confirmationPopupTopRow}>
              <button
                type="button"
                className={styles.confirmationPopupClose}
                onClick={() => setPendingPanelAction(null)}
                aria-label="Close"
              >
                <CloseIcon className={styles.confirmationPopupCloseIcon} />
              </button>
            </div>
            <div className={styles.confirmationPopupBody}>
              <img src={CONFIRMATION_ILLUSTRATION} alt="" className={styles.confirmationPopupIllustration} />
              <div className={styles.confirmationPopupContent}>
                <p className={styles.confirmationPopupTitle}>Discard changes?</p>
                <p className={styles.confirmationPopupDesc}>You have unsaved edits in this panel. Discard them before continuing?</p>
              </div>
              <div className={styles.confirmationPopupButtons}>
                <MainBtn variant="secondary" size="md" className="flex-1" onClick={() => setPendingPanelAction(null)} label="Keep Editing" />
                <MainBtn variant="primary" size="md" className="flex-1" onClick={confirmDiscardChanges} label="Yes, Discard" />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showPinModal ? (
        <div
          className={styles.pinModalOverlay}
          onClick={() => {
            setShowPinModal(false);
            setPinValue("");
            setPinError("");
            setPinVisible(false);
            setResendVerificationPrompt(null);
            setPinModalOtpMode(false);
            setOtpValues(["", "", "", "", "", ""]);
            setOtpError("");
            setOtpTimerActive(false);
          }}
        >
          <div className={cx(styles.pinModal, pinModalOtpMode && styles.pinModalWide)} onClick={(e) => e.stopPropagation()}>
            <div className={styles.pinModalHeader}>
              <button
                type="button"
                className={styles.pinModalClose}
                aria-label="Close"
                onClick={() => {
                  setShowPinModal(false);
                  setPinValue("");
                  setPinError("");
                  setPinVisible(false);
                  setResendVerificationPrompt(null);
                  setPinModalOtpMode(false);
                  setOtpValues(["", "", "", "", "", ""]);
                  setOtpError("");
                  setOtpTimerActive(false);
                }}
              >
                <CloseIcon className={styles.closeIcon} />
              </button>
            </div>
            {pinModalOtpMode ? (
              <>
                <p className={styles.pinModalTitle}>Enter OTP Code</p>
                <p className={styles.pinModalDesc}>
                  {otpChannel === "whatsapp" ? (
                    <>An OTP Code has been sent via WhatsApp to <strong>{selectedUser?.whatsapp}</strong></>
                  ) : (
                    <>An OTP Code has been sent via Email to<br /><strong>{selectedUser?.email !== "-" ? selectedUser?.email : "your registered contact"}</strong></>
                  )}
                </p>
                <div className={styles.otpBoxRow}>
                  {otpValues.map((val, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={styles.otpBox}
                      autoFocus={i === 0}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>
                {otpError ? <p className={styles.pinError}>{otpError}</p> : null}
                <p className={styles.otpResendText}>
                  {otpTimer > 0 ? (
                    <>Didn&apos;t receive OTP? Resend in {String(Math.floor(otpTimer / 60)).padStart(2, "0")}:{String(otpTimer % 60).padStart(2, "0")}</>
                  ) : otpResendAttemptsRemaining > 0 ? (
                    <>Didn&apos;t receive OTP?{" "}<button type="button" className={styles.otpResendBtn} onClick={resendOtp}>Resend now</button></>
                  ) : (
                    <>No more resend attempts available.</>
                  )}
                </p>
                {otpPurpose !== "contact-save" ? (
                  <>
                    <hr className={styles.otpSeparator} />
                    <button type="button" className={styles.otpCtaLink} onClick={switchBackToPin}>
                      Use PIN Instead
                    </button>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <p className={styles.pinModalTitle}>Confirm Changes</p>
                <p className={styles.pinModalDesc}>
                  Enter your 6-digit PIN to confirm changes.
                </p>
                <label className={styles.pinField}>
                  <div className={styles.pinFieldControl}>
                    <input
                      ref={pinInputRef}
                      type={pinVisible ? "text" : "password"}
                      inputMode="numeric"
                      maxLength={6}
                      value={pinValue}
                      disabled={pinIsBlocked}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setPinValue(val);
                        if (pinError) setPinError("");
                      }}
                      onKeyDown={(event) => { if (event.key === "Enter") confirmPinAndSave(); }}
                      className={cx(styles.pinFieldInput, pinError && styles.pinFieldInputError)}
                      autoFocus
                      aria-label="PIN"
                      placeholder="Enter 6-digit PIN"
                    />
                    <button
                      type="button"
                      className={styles.pinVisibilityButton}
                      aria-label={pinVisible ? "Hide PIN" : "Show PIN"}
                      onClick={() => setPinVisible((current) => !current)}
                    >
                      {pinVisible ? <EyeOffIcon className={styles.pinVisibilityIcon} /> : <EyeIcon className={styles.pinVisibilityIcon} />}
                    </button>
                  </div>
                  {pinError ? (
                    <div className={styles.pinFieldError}>
                      {pinError}
                    </div>
                  ) : null}
                </label>
                {pinIsBlocked ? (
                  <p className={styles.pinBlockMessage}>
                    Too many failed attempts. Try again in {formatPinBlockRemaining(pinBlockRemaining)}.
                  </p>
                ) : null}
                <div className={styles.pinModalActions}>
                  <MainBtn
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => {
                      setShowPinModal(false);
                      setPinValue("");
                      setPinError("");
                      setPinVisible(false);
                      setResendVerificationPrompt(null);
                    }}
                    label="Cancel"
                  />
                  <MainBtn variant="primary" size="lg" className="flex-1" onClick={confirmPinAndSave} disabled={pinIsBlocked} label="Save" />
                </div>
                <hr className={styles.otpSeparator} />
                <button type="button" className={cx(styles.otpCtaLink, pinIsBlocked && styles.otpCtaLinkActive)} onClick={() => switchToOtpMode("contact-save")}>
                  Use OTP Instead
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}

      {showRegeneratePinModal ? (
        <div className={styles.pinModalOverlay} onClick={closeRegeneratePinModal}>
          <div className={cx(styles.pinModal, pinModalOtpMode && styles.pinModalWide)} onClick={(e) => e.stopPropagation()}>
            <div className={styles.pinModalHeader}>
              <button type="button" className={styles.pinModalClose} aria-label="Close" onClick={closeRegeneratePinModal}>
                <CloseIcon className={styles.closeIcon} />
              </button>
            </div>
            {pinModalOtpMode ? (
              <>
                <p className={styles.pinModalTitle}>Enter OTP Code</p>
                <p className={styles.pinModalDesc}>
                  {otpChannel === "whatsapp" ? (
                    <>An OTP Code has been sent via WhatsApp to <strong>{selectedUser?.whatsapp}</strong></>
                  ) : (
                    <>An OTP Code has been sent via Email to<br /><strong>{selectedUser?.email !== "-" ? selectedUser?.email : "your registered contact"}</strong></>
                  )}
                </p>
                <div className={styles.otpBoxRow}>
                  {otpValues.map((val, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={styles.otpBox}
                      autoFocus={i === 0}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>
                {otpError ? <p className={styles.pinError}>{otpError}</p> : null}
                <p className={styles.otpResendText}>
                  {otpTimer > 0 ? (
                    <>Didn&apos;t receive OTP? Resend in {String(Math.floor(otpTimer / 60)).padStart(2, "0")}:{String(otpTimer % 60).padStart(2, "0")}</>
                  ) : otpResendAttemptsRemaining > 0 ? (
                    <>Didn&apos;t receive OTP?{" "}<button type="button" className={styles.otpResendBtn} onClick={resendOtp}>Resend now</button></>
                  ) : (
                    <>No more resend attempts available.</>
                  )}
                </p>
                <hr className={styles.otpSeparator} />
                <button type="button" className={styles.otpCtaLink} onClick={switchBackToPin}>
                  Use PIN Instead
                </button>
              </>
            ) : (
              <>
                <p className={styles.pinModalTitle}>Confirm Changes</p>
                <p className={styles.pinModalDesc}>
                  Enter your 6-digit PIN to confirm changes.
                </p>
                <label className={styles.pinField}>
                  <div className={styles.pinFieldControl}>
                    <input
                      type={regeneratePinVisible ? "text" : "password"}
                      inputMode="numeric"
                      maxLength={6}
                      value={regeneratePinValue}
                      disabled={pinIsBlocked}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setRegeneratePinValue(val);
                        if (regeneratePinError) setRegeneratePinError("");
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") confirmRegeneratePin(); }}
                      className={cx(styles.pinFieldInput, regeneratePinError && styles.pinFieldInputError)}
                      autoFocus
                      aria-label="PIN"
                      placeholder="Enter 6-digit PIN"
                    />
                    <button
                      type="button"
                      className={styles.pinVisibilityButton}
                      aria-label={regeneratePinVisible ? "Hide PIN" : "Show PIN"}
                      onClick={() => setRegeneratePinVisible((v) => !v)}
                    >
                      {regeneratePinVisible
                        ? <EyeOffIcon className={styles.pinVisibilityIcon} />
                        : <EyeIcon className={styles.pinVisibilityIcon} />}
                    </button>
                  </div>
                  {regeneratePinError ? (
                    <div className={styles.pinFieldError}>
                      {regeneratePinError}
                    </div>
                  ) : null}
                </label>
                {pinIsBlocked ? (
                  <p className={styles.pinBlockMessage}>
                    Too many failed attempts. Try again in {formatPinBlockRemaining(pinBlockRemaining)}.
                  </p>
                ) : null}
                <div className={styles.pinModalActions}>
                  <MainBtn variant="secondary" size="lg" className="flex-1" onClick={closeRegeneratePinModal} label="Cancel" />
                  <MainBtn variant="primary" size="lg" className="flex-1" onClick={confirmRegeneratePin} disabled={pinIsBlocked} label="Save" />
                </div>
                <hr className={styles.otpSeparator} />
                <button type="button" className={cx(styles.otpCtaLink, pinIsBlocked && styles.otpCtaLinkActive)} onClick={() => switchToOtpMode("regenerate-pin")}>
                  Use OTP Instead
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}

      {showActionPinModal ? (
        <div className={styles.pinModalOverlay} onClick={closeActionPinModal}>
          <div className={cx(styles.pinModal, pinModalOtpMode && styles.pinModalWide)} onClick={(e) => e.stopPropagation()}>
            <div className={styles.pinModalHeader}>
              <button type="button" className={styles.pinModalClose} aria-label="Close" onClick={closeActionPinModal}>
                <CloseIcon className={styles.closeIcon} />
              </button>
            </div>
            {pinModalOtpMode ? (
              <>
                <p className={styles.pinModalTitle}>Enter OTP Code</p>
                <p className={styles.pinModalDesc}>
                  {otpChannel === "whatsapp" ? (
                    <>An OTP Code has been sent via WhatsApp to <strong>{selectedUser?.whatsapp}</strong></>
                  ) : (
                    <>An OTP Code has been sent via Email to<br /><strong>{selectedUser?.email !== "-" ? selectedUser?.email : "your registered contact"}</strong></>
                  )}
                </p>
                <div className={styles.otpBoxRow}>
                  {otpValues.map((val, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={styles.otpBox}
                      autoFocus={i === 0}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>
                {otpError ? <p className={styles.pinError}>{otpError}</p> : null}
                <p className={styles.otpResendText}>
                  {otpTimer > 0 ? (
                    <>Didn&apos;t receive OTP? Resend in {String(Math.floor(otpTimer / 60)).padStart(2, "0")}:{String(otpTimer % 60).padStart(2, "0")}</>
                  ) : otpResendAttemptsRemaining > 0 ? (
                    <>Didn&apos;t receive OTP?{" "}<button type="button" className={styles.otpResendBtn} onClick={resendOtp}>Resend now</button></>
                  ) : (
                    <>No more resend attempts available.</>
                  )}
                </p>
                <hr className={styles.otpSeparator} />
                <button type="button" className={styles.otpCtaLink} onClick={switchBackToPin}>
                  Use PIN Instead
                </button>
              </>
            ) : (
              <>
                <p className={styles.pinModalTitle}>Confirm Changes</p>
                <p className={styles.pinModalDesc}>
                  Enter your 6-digit PIN to confirm changes.
                </p>
                <label className={styles.pinField}>
                  <div className={styles.pinFieldControl}>
                    <input
                      type={actionPinVisible ? "text" : "password"}
                      inputMode="numeric"
                      maxLength={6}
                      value={actionPinValue}
                      disabled={pinIsBlocked}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setActionPinValue(val);
                        if (actionPinError) setActionPinError("");
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") confirmActionPin(); }}
                      className={cx(styles.pinFieldInput, actionPinError && styles.pinFieldInputError)}
                      autoFocus
                      aria-label="PIN"
                      placeholder="Enter 6-digit PIN"
                    />
                    <button
                      type="button"
                      className={styles.pinVisibilityButton}
                      aria-label={actionPinVisible ? "Hide PIN" : "Show PIN"}
                      onClick={() => setActionPinVisible((v) => !v)}
                    >
                      {actionPinVisible
                        ? <EyeOffIcon className={styles.pinVisibilityIcon} />
                        : <EyeIcon className={styles.pinVisibilityIcon} />}
                    </button>
                  </div>
                  {actionPinError ? (
                    <div className={styles.pinFieldError}>
                      {actionPinError}
                    </div>
                  ) : null}
                </label>
                {pinIsBlocked ? (
                  <p className={styles.pinBlockMessage}>
                    Too many failed attempts. Try again in {formatPinBlockRemaining(pinBlockRemaining)}.
                  </p>
                ) : null}
                <div className={styles.pinModalActions}>
                  <MainBtn variant="secondary" size="lg" className="flex-1" onClick={closeActionPinModal} label="Cancel" />
                  <MainBtn variant="primary" size="lg" className="flex-1" onClick={confirmActionPin} disabled={pinIsBlocked} label="Save" />
                </div>
                <hr className={styles.otpSeparator} />
                <button
                  type="button"
                  className={cx(styles.otpCtaLink, pinIsBlocked && styles.otpCtaLinkActive)}
                  onClick={() => switchToOtpMode(actionPinType ?? "invite-user")}
                >
                  Use OTP Instead
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}

      {showResendChannelModal ? (
        <div className={styles.pinModalOverlay} onClick={() => setShowResendChannelModal(false)}>
          <div className={styles.resendChannelModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.pinModalHeader}>
              <button type="button" className={styles.pinModalClose} aria-label="Close" onClick={() => setShowResendChannelModal(false)}>
                <CloseIcon className={styles.closeIcon} />
              </button>
            </div>
            <div className={styles.resendChannelContent}>
              <div className={styles.resendChannelHeading}>
                <p className={styles.resendChannelTitle}>Resend OTP</p>
                <p className={styles.resendChannelSubtitle}>
                  <strong className={styles.resendAttemptsCount}>{otpResendAttemptsRemaining} more attempts</strong>
                  {" to resend OTP Code"}
                </p>
              </div>
              <div className={styles.resendChannelButtons}>
                <button type="button" className={cx(styles.resendChannelBtn, styles.resendChannelBtnPrimary)} onClick={() => selectResendChannel("whatsapp")}>
                  <WhatsAppIcon className={styles.resendChannelIcon} />
                  Send via WhatsApp
                </button>
                <button type="button" className={cx(styles.resendChannelBtn, styles.resendChannelBtnSecondary)} onClick={() => selectResendChannel("email")}>
                  <MailIcon className={styles.resendChannelIcon} />
                  Send via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showSnackbar ? (
        <div className={styles.snackbar} role="status">
          <CheckIcon className={styles.snackbarIcon} />
          <span>{snackbarMessage}</span>
        </div>
      ) : null}
    </div>
  );
}

export default UserManagementScreen;
