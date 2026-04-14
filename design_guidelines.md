# The Fitness Empire - Design Guidelines

## 1. Brand Identity

**Purpose**: A professional gym management platform that empowers gym owners to efficiently manage members while giving members transparent access to their subscription status.

**Aesthetic Direction**: **Bold/striking** with professional authority. Think athletic energy meets business precision - high contrast, confident typography, clear visual hierarchy. The app should feel powerful yet approachable, like a personal trainer who's got your back.

**Memorable Element**: Status-driven color coding throughout - at a glance, users instantly understand membership health through bold visual indicators (active/green, expiring/amber, expired/red).

## 2. Navigation Architecture

**Auth Required**: Yes - role-based (Owner/Member)

**Root Navigation**: Stack-only (role-specific dashboards serve as persistent homes)

**Screen Structure**:
- Login (entry point)
- Owner Dashboard (owner home)
  - Add Member (modal)
  - Edit Member (modal)
  - Plan Management (screen)
- Member Dashboard (member home)

## 3. Screen-by-Screen Specifications

### Login Screen
**Purpose**: Authenticate users and route to role-specific dashboard

**Layout**:
- Header: Standard with title "The Fitness Empire"
- Content: Centered form (not scrollable)
- Form fields: Email, Password
- Submit button below form
- Safe area: top = insets.top + 24, bottom = insets.bottom + 24

**Components**: Text inputs, primary button, loading indicator

### Owner Dashboard
**Purpose**: View all members at a glance with status indicators

**Layout**:
- Header: Standard with title "Members", right button (Settings icon → Plan Management)
- Content: Scrollable list of member cards
- Floating: FAB (bottom-right) with person_add icon
- Safe area: top = 24, bottom = insets.bottom + 80

**Components**: 
- Member card showing: name, status badge, days remaining, dues amount, action buttons (edit/view)
- Empty state when no members exist
- Status badges with bold color coding

### Member Dashboard
**Purpose**: Member views their personal subscription details

**Layout**:
- Header: Standard with title "My Membership", right button (Logout icon)
- Content: Scrollable card-based layout
- Safe area: top = 24, bottom = insets.bottom + 24

**Components**:
- Hero card with member name and status
- Info cards: Plan details, Amount paid, Dues remaining, Expiry date
- Large visual status indicator

### Add/Edit Member (Modal)
**Purpose**: Owner creates or updates member records

**Layout**:
- Header: Custom with title "Add Member"/"Edit Member", left button (Cancel), right button (Save)
- Content: Scrollable form
- Safe area: top = 24, bottom = insets.bottom + 24

**Components**: Text inputs (name, email, phone), dropdown (plan selection), date picker (start date), number inputs (paid amount), action buttons in header

### Plan Management Screen
**Purpose**: Owner configures available membership plans

**Layout**:
- Header: Standard with back button, title "Membership Plans"
- Content: Scrollable list of plan cards with editable fields
- Safe area: top = 24, bottom = insets.bottom + 24

**Components**: Plan cards (1-month, 3-month, 6-month, 12-month) with price inputs, save button per card

## 4. Color Palette

**Primary**: #FF6B00 (Energetic Orange) - CTAs, active states, branding  
**Accent**: #000000 (Bold Black) - Headers, emphasis, icons  
**Background**: #F5F5F5 (Light Gray) - Screen backgrounds  
**Surface**: #FFFFFF (White) - Cards, modals  
**Text Primary**: #1A1A1A (Near Black)  
**Text Secondary**: #666666 (Medium Gray)  
**Success**: #00C853 (Vibrant Green) - Active memberships  
**Warning**: #FFA000 (Amber) - Expiring soon  
**Error**: #D32F2F (Strong Red) - Expired/overdue  
**Border**: #E0E0E0 (Light Border)

## 5. Typography

**Font**: System default (Roboto on Android, SF Pro on iOS)

**Type Scale**:
- Hero: Bold, 32px
- H1: Bold, 24px
- H2: SemiBold, 20px
- H3: SemiBold, 18px
- Body: Regular, 16px
- Caption: Regular, 14px
- Small: Regular, 12px

## 6. Assets to Generate

**icon.png** - App icon featuring a stylized dumbbell with "FE" letters in orange/black  
*WHERE USED*: Device home screen

**splash-icon.png** - Same as app icon, centered on splash screen  
*WHERE USED*: App launch screen

**empty-members.png** - Illustration of a gym with empty equipment floor, subtle grayscale with orange accent  
*WHERE USED*: Owner Dashboard when no members exist

**member-avatar-default.png** - Silhouette of athletic figure in circular frame, black on orange gradient  
*WHERE USED*: Member cards and Member Dashboard when no custom photo

**status-active-badge.svg** - Checkmark icon in circle  
*WHERE USED*: Active membership indicators

**status-warning-badge.svg** - Clock icon in circle  
*WHERE USED*: Expiring soon indicators

**status-expired-badge.svg** - X icon in circle  
*WHERE USED*: Expired membership indicators