import HT_Logo from './static/img/HT_Logo.png';
import sort_asc from './static/img/sort_asc.png';
import sort_desc from './static/img/sort_desc.png';
import sort from './static/img/sort.png';
import {colors} from './static/colors';
import { stop_marker_icons } from './static/stop-marker-index';
import { marker_icons } from './static/marker-index';

export const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
export const HT_LOGO = HT_Logo;
export const SORT_ASC = sort_asc;
export const SORT_DESC = sort_desc;
export const SORT = sort;

export const MARKER_COLORS = colors;
export const MARKER_ICONS = marker_icons;
export const STOP_MARKER_ICONS = stop_marker_icons;

export const SITE_NAME = "Hypothetical Transportation Bus Management System";
export const API_DOMAIN = "http://localhost:8000/api/"
// export const API_DOMAIN = "https://vcm-25243.vm.duke.edu/api/"

// Link URLs
export const INDEX_URL = "/";
export const LOGIN_URL = "/login";

export const SCHOOLS_URL = "/schools";
export const STUDENTS_URL = "/students";
export const USERS_URL = "/users";
export const ROUTES_URL = "/routes";

export const USERS_IMPORT_URL = "/users/import";
export const STUDENTS_IMPORT_URL = "/students/import";

export const SCHOOLS_DETAIL_URL = "/schools/:id";
export const STUDENTS_DETAIL_URL = "/students/:id";
export const USERS_DETAIL_URL = "/users/:id";
export const ROUTES_DETAIL_URL = "/routes/:id";

export const SCHOOLS_CREATE_URL = "/schools/create";
export const USERS_CREATE_URL = "/users/create";
export const ROUTES_PLANNER_URL = "/schools/:id/routes-planner";

export const SCHOOLS_EDIT_URL = "/schools/:id/edit";
export const STUDENTS_EDIT_URL = "/students/:id/edit";
export const USERS_EDIT_URL = "/users/:id/edit";
export const USERS_PASSWORD_URL = "/users/:id/change-password";
export const ROUTES_EDIT_URL = "/routes/:id/edit";

export const SCHOOLS_EMAIL_URL = "/schools/:id/email";
export const ROUTES_EMAIL_URL = "/routes/:id/email";
export const USERS_EMAIL_URL = "/users/email";

export const PARENT_DASHBOARD_URL = "/dashboard";
export const PARENT_DETAIL_URL = "/dashboard/:id";

export const PASSWORD_URL = "/change-password";
export const EMAIL_RESET_URL = "/email-reset";
export const RESET_PASSWORD_URL = "/reset-password/:uuid&:token";
export const ACCOUNT_URL = "/account";
export const ACCOUNT_ACTIVATION_URL = "/account-activation/:uuid&:token";

export const GOOGLE_MAP_URL = "https://www.google.com/maps/dir/?api=1&"
export const ROUTES_TRANSIT_LOG_URL = "/routes/:id/transit-log";
export const SCHOOLS_TRANSIT_STATUS_URL = "/schools/:id/transit-status";

