export const emailRegex = new RegExp(
    '^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+.)+[a-zA-Z]{2,6}$'
);

export const passwordRegex = new RegExp(
    '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$'
);

export const phoneRegex = new RegExp(
    "^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$"
);

 //(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\])
 
 
 