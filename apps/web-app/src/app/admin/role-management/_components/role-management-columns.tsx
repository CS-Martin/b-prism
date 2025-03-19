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
            accessorKey: 'created_at',
            header: 'Create Date',
            cell: ({ cell }) => {
                const date = new Date(cell.getValue() as string);
                return date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                });
            },
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
        },
    ];
};
