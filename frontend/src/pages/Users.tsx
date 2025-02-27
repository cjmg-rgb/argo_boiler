import AppBreadCrumb from "@/components/common/AppBreadCrumb";
import UsersDataTable from "@/components/users/UsersDataTable";

const Users = () => {
  return (
    <div className="p-9">
      <AppBreadCrumb currentPageLabel="Users" currentPageHref="/users" />
      <UsersDataTable />
    </div>
  );
};

export default Users;
