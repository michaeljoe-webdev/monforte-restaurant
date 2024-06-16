const initialState = {
    theme: localStorage.getItem('theme') || "light",
    route: localStorage.getItem('route') || "",
    menu: localStorage.getItem('menu') || [],
};

const userReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case "THEME":
            localStorage.setItem('theme', payload.theme);
            return { ...state, ...payload };
        case "ROUTE":
            localStorage.setItem('route', payload.route);
            return { ...state, ...payload };
        case "MENU":
            localStorage.setItem('menu', payload.menu);
            return { ...state, ...payload };
        default:
            return state;
    }
}

export default userReducer;
