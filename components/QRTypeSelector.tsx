"use client";
import React, { useState, useEffect } from "react";
import {
    GlobeIcon,
    TextIcon,
    WifiIcon,
    MailIcon,
    PhoneIcon,
    MessageCircleIcon,
    MapPinIcon,
    UsersIcon,
    CalendarIcon,
    DollarSignIcon,
} from "./Icons";
import { encodeQRData, validateQRData } from "../lib/qr-types";
import { ValidationError } from "../types/qr.types";
import { getFieldError, hasFieldError } from "../lib/utils/error-formatter";
import ValidationMessage from "./ValidationMessage";

interface QRTypeSelectorProps {
    selectedType: string;
    onTypeChange: (type: string) => void;
    onQrValueChange: (value: string) => void;
}

// ── Reusable field components ─────────────────────────────────────────────────
const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-1.5">
        {children}
    </p>
);

const TextInput: React.FC<{
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    hasError?: boolean;
    onBlur?: () => void;
    ariaInvalid?: boolean;
}> = ({
    value,
    onChange,
    placeholder,
    type = "text",
    hasError = false,
    onBlur,
    ariaInvalid = false,
}) => (
    <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint outline-none focus:ring-2 transition ${
            hasError
                ? "border-rose focus:border-rose focus:ring-rose/30"
                : "border-lavender/40 focus:border-lavender focus:ring-lavender/30"
        }`}
    />
);

const SelectInput: React.FC<{
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}> = ({ value, onChange, options }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-lavender/40 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/30 appearance-none cursor-pointer"
    >
        {options.map((o) => (
            <option key={o.value} value={o.value}>
                {o.label}
            </option>
        ))}
    </select>
);

// ── QR type definitions ───────────────────────────────────────────────────────
const QR_TYPES = [
    { name: "Website", icon: GlobeIcon, hint: "Link to any URL" },
    { name: "Text", icon: TextIcon, hint: "Plain text message" },
    { name: "Wi-Fi", icon: WifiIcon, hint: "Share Wi-Fi credentials" },
    { name: "Contact", icon: UsersIcon, hint: "vCard contact card" },
    { name: "Email", icon: MailIcon, hint: "Pre-filled email" },
    { name: "SMS", icon: MessageCircleIcon, hint: "Pre-filled SMS" },
    { name: "Phone", icon: PhoneIcon, hint: "Dial a number" },
    { name: "WhatsApp", icon: MessageCircleIcon, hint: "WhatsApp message" },
    { name: "Location", icon: MapPinIcon, hint: "GPS coordinates" },
    { name: "Social", icon: UsersIcon, hint: "Social profile link" },
    { name: "Event", icon: CalendarIcon, hint: "Calendar event" },
    { name: "Pay me", icon: DollarSignIcon, hint: "Payment link" },
];

// ── Per-type form state defaults ──────────────────────────────────────────────
const DEFAULT_FIELDS: Record<string, Record<string, string>> = {
    Website: { url: "https://" },
    Text: { text: "" },
    "Wi-Fi": { ssid: "", password: "", encryption: "WPA", hidden: "false" },
    Contact: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        organization: "",
        website: "",
    },
    Email: { to: "", subject: "", body: "" },
    SMS: { phone: "", message: "" },
    Phone: { phone: "" },
    WhatsApp: { phone: "", message: "" },
    Location: { latitude: "", longitude: "", label: "" },
    Social: { platform: "instagram", username: "" },
    Event: {
        title: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
    },
    "Pay me": { platform: "paypal", username: "", amount: "" },
};

const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({
    selectedType,
    onTypeChange,
    onQrValueChange,
}) => {
    const [fields, setFields] =
        useState<Record<string, Record<string, string>>>(DEFAULT_FIELDS);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

    // Validate current form
    const validateCurrentForm = () => {
        const result = validateQRData(fields[selectedType], selectedType);
        setErrors(result.errors);
        return result.valid;
    };

    // Handle field blur - validate on blur
    const handleFieldBlur = (fieldName: string) => {
        setTouchedFields((prev) => new Set(prev).add(fieldName));
        validateCurrentForm();
    };

    // When fields change, encode and push up
    const updateField = (type: string, key: string, value: string) => {
        const next = { ...fields, [type]: { ...fields[type], [key]: value } };
        setFields(next);
        try {
            const encoded = encodeQRData(next[type], type);
            onQrValueChange(encoded);
            // Clear errors for this field if encoding succeeds
            if (touchedFields.has(key)) {
                validateCurrentForm();
            }
        } catch {
            // partial input — keep last valid value
        }
    };

    // Re-encode when type changes — call both handlers atomically
    const handleTypeChange = (name: string) => {
        onTypeChange(name);
        // Clear errors and touched fields when switching types
        setErrors([]);
        setTouchedFields(new Set());
        try {
            const encoded = encodeQRData(fields[name], name);
            onQrValueChange(encoded);
        } catch {
            onQrValueChange("");
        }
    };

    // Also re-encode via effect as safety net (handles external selectedType changes)
    useEffect(() => {
        try {
            const encoded = encodeQRData(fields[selectedType], selectedType);
            onQrValueChange(encoded);
        } catch {
            /* ignore */
        }
    }, [selectedType]); // eslint-disable-line react-hooks/exhaustive-deps

    const f = fields[selectedType] ?? {};
    const set = (key: string) => (v: string) =>
        updateField(selectedType, key, v);

    // ── Per-type form ─────────────────────────────────────────────────────────
    const renderForm = () => {
        switch (selectedType) {
            case "Website":
                return (
                    <div>
                        <FieldLabel>Website URL</FieldLabel>
                        <TextInput
                            value={f.url}
                            onChange={set("url")}
                            onBlur={() => handleFieldBlur("url")}
                            placeholder="https://example.com"
                            type="url"
                            hasError={hasFieldError(errors, "url")}
                            ariaInvalid={hasFieldError(errors, "url")}
                        />
                        <ValidationMessage
                            message={getFieldError(errors, "url") || ""}
                            visible={
                                touchedFields.has("url") &&
                                hasFieldError(errors, "url")
                            }
                        />
                    </div>
                );

            case "Text":
                return (
                    <div>
                        <FieldLabel>Your text</FieldLabel>
                        <textarea
                            value={f.text}
                            onChange={(e) =>
                                updateField("Text", "text", e.target.value)
                            }
                            onBlur={() => handleFieldBlur("text")}
                            placeholder="Type anything..."
                            rows={3}
                            aria-invalid={hasFieldError(errors, "text")}
                            className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint outline-none focus:ring-2 resize-none transition ${
                                hasFieldError(errors, "text")
                                    ? "border-rose focus:border-rose focus:ring-rose/30"
                                    : "border-lavender/40 focus:border-lavender focus:ring-lavender/30"
                            }`}
                        />
                        <ValidationMessage
                            message={getFieldError(errors, "text") || ""}
                            visible={
                                touchedFields.has("text") &&
                                hasFieldError(errors, "text")
                            }
                        />
                    </div>
                );

            case "Wi-Fi":
                return (
                    <div className="space-y-3">
                        <div>
                            <FieldLabel>Network name (SSID)</FieldLabel>
                            <TextInput
                                value={f.ssid}
                                onChange={set("ssid")}
                                onBlur={() => handleFieldBlur("ssid")}
                                placeholder="MyNetwork"
                                hasError={hasFieldError(errors, "ssid")}
                                ariaInvalid={hasFieldError(errors, "ssid")}
                            />
                            <ValidationMessage
                                message={getFieldError(errors, "ssid") || ""}
                                visible={
                                    touchedFields.has("ssid") &&
                                    hasFieldError(errors, "ssid")
                                }
                            />
                        </div>
                        <div>
                            <FieldLabel>Password</FieldLabel>
                            <TextInput
                                value={f.password}
                                onChange={set("password")}
                                onBlur={() => handleFieldBlur("password")}
                                placeholder="••••••••"
                                type="password"
                                hasError={hasFieldError(errors, "password")}
                                ariaInvalid={hasFieldError(errors, "password")}
                            />
                            <ValidationMessage
                                message={
                                    getFieldError(errors, "password") || ""
                                }
                                visible={
                                    touchedFields.has("password") &&
                                    hasFieldError(errors, "password")
                                }
                            />
                        </div>
                        <div>
                            <FieldLabel>Security</FieldLabel>
                            <SelectInput
                                value={f.encryption}
                                onChange={set("encryption")}
                                options={[
                                    { value: "WPA", label: "WPA / WPA2" },
                                    { value: "WEP", label: "WEP" },
                                    { value: "nopass", label: "None (open)" },
                                ]}
                            />
                        </div>
                    </div>
                );

            case "Contact":
                return (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <FieldLabel>First name</FieldLabel>
                                <TextInput
                                    value={f.firstName}
                                    onChange={set("firstName")}
                                    placeholder="Jane"
                                />
                            </div>
                            <div>
                                <FieldLabel>Last name</FieldLabel>
                                <TextInput
                                    value={f.lastName}
                                    onChange={set("lastName")}
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                        <div>
                            <FieldLabel>Phone</FieldLabel>
                            <TextInput
                                value={f.phone}
                                onChange={set("phone")}
                                placeholder="+1 234 567 8900"
                                type="tel"
                            />
                        </div>
                        <div>
                            <FieldLabel>Email</FieldLabel>
                            <TextInput
                                value={f.email}
                                onChange={set("email")}
                                placeholder="jane@example.com"
                                type="email"
                            />
                        </div>
                        <div>
                            <FieldLabel>Organization</FieldLabel>
                            <TextInput
                                value={f.organization}
                                onChange={set("organization")}
                                placeholder="Acme Inc."
                            />
                        </div>
                        <div>
                            <FieldLabel>Website</FieldLabel>
                            <TextInput
                                value={f.website}
                                onChange={set("website")}
                                placeholder="https://example.com"
                                type="url"
                            />
                        </div>
                    </div>
                );

            case "Email":
                return (
                    <div className="space-y-3">
                        <div>
                            <FieldLabel>To</FieldLabel>
                            <TextInput
                                value={f.to}
                                onChange={set("to")}
                                placeholder="recipient@example.com"
                                type="email"
                            />
                        </div>
                        <div>
                            <FieldLabel>Subject</FieldLabel>
                            <TextInput
                                value={f.subject}
                                onChange={set("subject")}
                                placeholder="Hello!"
                            />
                        </div>
                        <div>
                            <FieldLabel>Message</FieldLabel>
                            <textarea
                                value={f.body}
                                onChange={(e) =>
                                    updateField("Email", "body", e.target.value)
                                }
                                placeholder="Your message..."
                                rows={3}
                                className="w-full rounded-2xl border border-lavender/40 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/30 resize-none"
                            />
                        </div>
                    </div>
                );

            case "SMS":
                return (
                    <div className="space-y-3">
                        <div>
                            <FieldLabel>Phone number</FieldLabel>
                            <TextInput
                                value={f.phone}
                                onChange={set("phone")}
                                placeholder="+1 234 567 8900"
                                type="tel"
                            />
                        </div>
                        <div>
                            <FieldLabel>Message (optional)</FieldLabel>
                            <TextInput
                                value={f.message}
                                onChange={set("message")}
                                placeholder="Hi there!"
                            />
                        </div>
                    </div>
                );

            case "Phone":
                return (
                    <div>
                        <FieldLabel>Phone number</FieldLabel>
                        <TextInput
                            value={f.phone}
                            onChange={set("phone")}
                            placeholder="+1 234 567 8900"
                            type="tel"
                        />
                    </div>
                );

            case "WhatsApp":
                return (
                    <div className="space-y-3">
                        <div>
                            <FieldLabel>Phone number</FieldLabel>
                            <TextInput
                                value={f.phone}
                                onChange={set("phone")}
                                placeholder="+1 234 567 8900"
                                type="tel"
                            />
                        </div>
                        <div>
                            <FieldLabel>
                                Pre-filled message (optional)
                            </FieldLabel>
                            <TextInput
                                value={f.message}
                                onChange={set("message")}
                                placeholder="Hey! 👋"
                            />
                        </div>
                    </div>
                );

            case "Location":
                return (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <FieldLabel>Latitude</FieldLabel>
                                <TextInput
                                    value={f.latitude}
                                    onChange={set("latitude")}
                                    placeholder="37.7749"
                                />
                            </div>
                            <div>
                                <FieldLabel>Longitude</FieldLabel>
                                <TextInput
                                    value={f.longitude}
                                    onChange={set("longitude")}
                                    placeholder="-122.4194"
                                />
                            </div>
                        </div>
                        <div>
                            <FieldLabel>Label (optional)</FieldLabel>
                            <TextInput
                                value={f.label}
                                onChange={set("label")}
                                placeholder="San Francisco"
                            />
                        </div>
                    </div>
                );

            case "Social":
                return (
                    <div className="space-y-3">
                        <div>
                            <FieldLabel>Platform</FieldLabel>
                            <SelectInput
                                value={f.platform}
                                onChange={set("platform")}
                                options={[
                                    { value: "instagram", label: "Instagram" },
                                    { value: "tiktok", label: "TikTok" },
                                    { value: "twitter", label: "X / Twitter" },
                                    { value: "linkedin", label: "LinkedIn" },
                                    { value: "youtube", label: "YouTube" },
                                    { value: "facebook", label: "Facebook" },
                                    { value: "github", label: "GitHub" },
                                    { value: "threads", label: "Threads" },
                                ]}
                            />
                        </div>
                        <div>
                            <FieldLabel>Username</FieldLabel>
                            <TextInput
                                value={f.username}
                                onChange={set("username")}
                                placeholder="@yourhandle"
                            />
                        </div>
                    </div>
                );

            case "Event":
                return (
                    <div className="space-y-3">
                        <div>
                            <FieldLabel>Event title</FieldLabel>
                            <TextInput
                                value={f.title}
                                onChange={set("title")}
                                placeholder="Team meetup"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <FieldLabel>Start</FieldLabel>
                                <TextInput
                                    value={f.startDate}
                                    onChange={set("startDate")}
                                    placeholder="2026-06-01T10:00"
                                    type="datetime-local"
                                />
                            </div>
                            <div>
                                <FieldLabel>End</FieldLabel>
                                <TextInput
                                    value={f.endDate}
                                    onChange={set("endDate")}
                                    placeholder="2026-06-01T12:00"
                                    type="datetime-local"
                                />
                            </div>
                        </div>
                        <div>
                            <FieldLabel>Location (optional)</FieldLabel>
                            <TextInput
                                value={f.location}
                                onChange={set("location")}
                                placeholder="123 Main St"
                            />
                        </div>
                        <div>
                            <FieldLabel>Description (optional)</FieldLabel>
                            <TextInput
                                value={f.description}
                                onChange={set("description")}
                                placeholder="Bring your laptop"
                            />
                        </div>
                    </div>
                );

            case "Pay me":
                return (
                    <div className="space-y-3">
                        <div>
                            <FieldLabel>Platform</FieldLabel>
                            <SelectInput
                                value={f.platform}
                                onChange={set("platform")}
                                options={[
                                    { value: "paypal", label: "PayPal" },
                                    { value: "venmo", label: "Venmo" },
                                    { value: "cashapp", label: "Cash App" },
                                    { value: "revolut", label: "Revolut" },
                                ]}
                            />
                        </div>
                        <div>
                            <FieldLabel>Username / handle</FieldLabel>
                            <TextInput
                                value={f.username}
                                onChange={set("username")}
                                placeholder="yourname"
                            />
                        </div>
                        <div>
                            <FieldLabel>Amount (optional)</FieldLabel>
                            <TextInput
                                value={f.amount}
                                onChange={set("amount")}
                                placeholder="10.00"
                                type="number"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const selectedMeta = QR_TYPES.find((t) => t.name === selectedType);

    return (
        <div className="bg-white rounded-(--radius-card) p-4 sm:p-6 shadow-(--shadow-soft)">
            <h2 className="text-lg sm:text-xl font-display font-bold text-ink mb-1">
                1. What&apos;s inside?
            </h2>
            <p className="text-xs text-ink-soft mb-5">
                Pick a type and fill in the details.
            </p>

            {/* Type grid — 4 columns, square buttons */}
            <div className="grid grid-cols-4 gap-2 mb-5">
                {QR_TYPES.map(({ name, icon: Icon }) => {
                    const active = selectedType === name;
                    return (
                        <button
                            key={name}
                            onClick={() => handleTypeChange(name)}
                            className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 text-[11px] font-display font-semibold transition aspect-square ${
                                active
                                    ? "bg-peach/40 text-ink"
                                    : "bg-cream-deep text-ink-soft hover:text-ink"
                            }`}
                        >
                            <Icon
                                width={22}
                                height={22}
                                className={
                                    active ? "text-peach-deep" : "text-ink-soft"
                                }
                            />
                            <span className="text-center leading-tight">
                                {name}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Form area — cream background, sub-label + fields */}
            <div className="rounded-2xl bg-cream-deep/60 px-4 py-4">
                {/* Sub-label */}
                {selectedMeta && (
                    <p className="flex items-center gap-1.5 text-xs text-ink-soft mb-3">
                        <selectedMeta.icon
                            width={13}
                            height={13}
                            className="text-ink-faint"
                        />
                        {selectedMeta.hint}
                    </p>
                )}
                {renderForm()}
            </div>
        </div>
    );
};

export default QRTypeSelector;
