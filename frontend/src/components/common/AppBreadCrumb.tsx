import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbEllipsis,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { navLinks } from "../shared/AppSidebar";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  currentPageLabel: string;
  currentPageHref: string;
}

const AppBreadCrumb = ({ currentPageLabel, currentPageHref }: Props) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb className="mb-10">
      <BreadcrumbList>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {navLinks.map((navLink) => (
                <DropdownMenuItem
                  key={navLink.href}
                  onClick={() => navigate(navLink.href)}
                >
                  {navLink.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Link to={currentPageHref}>{currentPageLabel}</Link>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadCrumb;
