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
            header: 'Created Date',
            cell: ({ row }) => {
                const date = new Date(row.getValue('created_at') as string);
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
