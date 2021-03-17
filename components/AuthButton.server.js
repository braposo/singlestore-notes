import React from 'react';

import EditButton from './EditButton.client';

export default function AuthButton({ children, ...props }) {
    return <EditButton {...props}>{children}</EditButton>;
}
