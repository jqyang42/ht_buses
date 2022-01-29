import HT_Logo from './static/img/HT_Logo.png';
import sort_asc from './static/img/sort_asc.png';
import sort_desc from './static/img/sort_desc.png';
import sort from './static/img/sort.png';

export const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
export const HT_LOGO = HT_Logo;
export const SORT_ASC = sort_asc;
export const SORT_DESC = sort_desc;
export const SORT = sort;

export const SITE_NAME = "Hypothetical Transportation Bus Management System";
export const API_DOMAIN = "http://localhost:8000/"

// Link URLs
export const INDEX_URL = "/";

export const SCHOOLS_URL = "/schools";
export const STUDENTS_URL = "/students";
export const USERS_URL = "/users";
export const ROUTES_URL = "/routes";

export const SCHOOLS_DETAIL_URL = "/schools/:id";
export const STUDENTS_DETAIL_URL = "/students/:id";
export const USERS_DETAIL_URL = "/users/:id";
export const ROUTES_DETAIL_URL = "/routes/:id";

export const SCHOOLS_CREATE_URL = "/schools/create";
export const USERS_CREATE_URL = "/users/create";
export const ROUTES_PLANNER_URL = "/schools/routes-planner";

export const SCHOOLS_EDIT_URL = "/schools/:id/edit";
export const STUDENTS_EDIT_URL = "/students/:id/edit";
export const USERS_EDIT_URL = "/users/:id/edit";
export const USERS_PASSWORD_URL = "/users/:id/change-password";
export const ROUTES_EDIT_URL = "/routes/:id/edit";

export const PARENT_DASHBOARD_URL = "/dashboard";
export const PARENT_DETAIL_URL = "/dashboard/:id";
