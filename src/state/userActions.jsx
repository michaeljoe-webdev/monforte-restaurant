export const themeAction = ( theme ) => {
    return {
        type: "THEME",
        payload: { theme }
    }
}

export const routesAction = ( route ) => {
    return {
        type: "ROUTE",
        payload: { route }
    }
}

export const menuAction = ( menu ) => {
    return {
        type: "MENU",
        payload: { menu }
    }
}