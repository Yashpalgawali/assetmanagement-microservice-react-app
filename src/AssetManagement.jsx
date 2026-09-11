import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import CompanyComponent from "./Component/CompanyComponent/CompanyComponent";
import ViewCompanyComponent from "./Component/CompanyComponent/ViewCompanyComponent";
import DesignationComponent from "./Component/Designation/DesignationComponent";
import ViewDesignationComponent from "./Component/Designation/ViewDesignationComponent";
import LoginComponent from "./Component/LoginComponent";
import ErrorComponent from "./Component/ErrorComponent";
//import AuthProvider, { useAuth } from "./Component/Security/authContext";
import { AuthProvider, useAuth } from "./Component/Security/authContext";
import { ToastContainer } from "react-toastify";
import AssetTypeComponent from "./Component/AssetTypeComponent/AssetTypeComponent";
import ViewAssetTypeComponent from "./Component/AssetTypeComponent/ViewAssetTypeComponent";
import AssetComponent from "./Component/AssetComponent/AssetComponent";
import ViewAssetsComponent from "./Component/AssetComponent/ViewAssetsComponent";
import DepartmentComponent from "./Component/DepartmentComponent/DepartmentComponent";
import ViewDepartmentComponent from "./Component/DepartmentComponent/ViewDepartmentComponent";
import ViewEmployeeComponent from "./Component/EmployeeComponent/ViewEmployeeComponent";
import EmployeeComponent from "./Component/EmployeeComponent/EmployeeComponent";
import DashboardLayout from "./Component/Layout/DashboardLayout";
import Dashboard from "./Component/Dashboard";
import ViewAsssignedAssetsOfEmployeeComponent from "./Component/EmployeeComponent/ViewAsssignedAssetsOfEmployeeComponent";
import ViewAsssignedAssetsComponent from "./Component/EmployeeComponent/ViewAsssignedAssetsComponent";
import ChangePassword from "./Component/ChangePassword";
import OAuthCallbackComponent from "./Component/OAuthCallbackComponent";

function AuthenticatedRoute({ children }) {
    // const authContext = useAuth()
    // if (authContext.isAuthenticated)
    //     return children
    // return <Navigate to="/login" />
    const {
        initialized,
        isAuthenticated
    } = useAuth();

    if (!initialized) {
        return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default function AssetManagement() {
    return (
        <>
            <AuthProvider>
                <BrowserRouter basename="/assetmanagement" >
                    {/* <HeaderComponent /> */}

                    <ToastContainer position="top-center" autoClose={3000} />
                    <Routes>
                        <Route path="/" element={
                            <AuthenticatedRoute>
                                <DashboardLayout>
                                    <Dashboard /></DashboardLayout>
                            </AuthenticatedRoute>
                        }
                        />

                        <Route path='/company/:id' element={
                            <AuthenticatedRoute>
                                <DashboardLayout>
                                    <CompanyComponent />
                                </DashboardLayout>
                            </AuthenticatedRoute>}></Route>

                        <Route path='/viewcompanies' element={
                            <AuthenticatedRoute>
                                <DashboardLayout>
                                    <ViewCompanyComponent />
                                </DashboardLayout>
                            </AuthenticatedRoute>}></Route>

                        <Route path='/designation/:id' element={
                            <AuthenticatedRoute>
                                <DashboardLayout>
                                    <DesignationComponent />
                                </DashboardLayout>
                            </AuthenticatedRoute>
                        }></Route>
                        <Route path='/assettype/:id' element={
                            <AuthenticatedRoute>
                                <DashboardLayout>
                                    <AssetTypeComponent />
                                </DashboardLayout>
                            </AuthenticatedRoute>
                        }></Route>
                        <Route path='/viewassettypes' element={
                            <AuthenticatedRoute><DashboardLayout><ViewAssetTypeComponent /></DashboardLayout> </AuthenticatedRoute>}></Route>

                        <Route path='/asset/:id' element={
                            <AuthenticatedRoute>
                                <DashboardLayout>
                                    <AssetComponent />
                                </DashboardLayout>
                            </AuthenticatedRoute>
                        }></Route>

                        <Route path='/viewassets' element={
                            <AuthenticatedRoute><DashboardLayout><ViewAssetsComponent /></DashboardLayout> </AuthenticatedRoute>}>
                        </Route>

                        <Route path='/department/:id' element={
                            <AuthenticatedRoute>
                                <DashboardLayout>
                                    <DepartmentComponent />
                                </DashboardLayout>
                            </AuthenticatedRoute>
                        }></Route>

                        <Route path='/viewdepartments' element={
                            <AuthenticatedRoute><DashboardLayout><ViewDepartmentComponent /> </DashboardLayout></AuthenticatedRoute>}>
                        </Route>
                        <Route path='/change/password' element={
                            <AuthenticatedRoute><DashboardLayout><ChangePassword /> </DashboardLayout></AuthenticatedRoute>}>
                        </Route>

                        <Route path='/employee/:id' element={
                            <AuthenticatedRoute>
                                <DashboardLayout>
                                    <EmployeeComponent />
                                </DashboardLayout>
                            </AuthenticatedRoute>
                        }></Route>

                        <Route path='/viewemployees' element={
                            <AuthenticatedRoute><DashboardLayout><ViewEmployeeComponent /></DashboardLayout> </AuthenticatedRoute>}>
                        </Route>

                        <Route path='/viewassignedassets' element={
                            <AuthenticatedRoute><DashboardLayout><ViewAsssignedAssetsComponent /></DashboardLayout> </AuthenticatedRoute>}>
                        </Route>

                        <Route path='/viewassignedassets/:id' element={
                            <AuthenticatedRoute><DashboardLayout><ViewAsssignedAssetsOfEmployeeComponent /></DashboardLayout> </AuthenticatedRoute>}>
                        </Route>


                        <Route path='/viewdesignations' element={
                            <AuthenticatedRoute><DashboardLayout><ViewDesignationComponent /></DashboardLayout> </AuthenticatedRoute>}></Route>

                        <Route path='/login' element={<LoginComponent />}></Route>
                        <Route path='/callback' element={<OAuthCallbackComponent />}></Route>
                        <Route path='*' element={<ErrorComponent />}></Route>
                    </Routes>

                </BrowserRouter>
            </AuthProvider>
        </>
    )
}
