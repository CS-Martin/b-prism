export const CreateRoleDatatableColumns = () => {
    return [
        {
            accessorKey: 'id',
            header: 'Role ID',
        },
        {
            accessorKey: 'name',
            header: 'Role Name',
        },
        {
            accessorKey: 'description',
            header: 'Role Description',
        },
        {
            accessorKey: 'permissions',
            header: 'Permissions',
        },
        {
            accessorKey: 'createdAt',
            header: 'Create Date',
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
        },
    ];
};
