import React, {useEffect} from "react";
import {Authenticated, Refine,} from "@refinedev/core";
import {
  ErrorComponent,
  RefineThemes,
  ThemedLayoutV2,
  ThemedTitleV2,
  useNotificationProvider,
} from "@refinedev/mantine";
import {NotificationsProvider} from "@mantine/notifications";
import {ColorScheme, ColorSchemeProvider, Global, MantineProvider} from "@mantine/core";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";

import {
  ComponentCreate,
  ComponentEdit,
  ComponentList,
  ComponentShow,
  EntitlementCreate,
  EntitlementEdit,
  EntitlementList,
  EntitlementShow,
  LicenseCreate,
  LicenseEdit,
  LicenseList,
  LicenseShow,
  MachineCreate,
  MachineEdit,
  MachineList,
  MachineShow,
  PolicyCreate,
  PolicyEdit,
  PolicyList,
  PolicyShow,
  ProcessCreate,
  ProcessEdit,
  ProcessList,
  ProcessShow,
  ProductCreate,
  ProductEdit,
  ProductList,
  ProductShow,
  TokenCreate,
  TokenEdit,
  TokenList,
  TokenShow, UserCreate, UserEdit, UserList, UserShow,
  WebhookCreate,
  WebhookEdit,
  WebhookList,
  WebhookShow,
} from "./pages";
import {authProvider} from "./_util/providers/auth-provider";
import Login from "./pages/Login";
import {keygenshDataProvider} from "./_util/providers/data-provider";
import {IconKey} from "@tabler/icons-react";
import useAppStateStore from "./_util/appState";
import {Header} from "./components/header";
import {siteConstants} from "./siteConstants";


const App: React.FC = () => {
  const darkMode = useAppStateStore(state => state.darkMode) as ColorScheme
  const toggleDarkMode = useAppStateStore(state => state.toggleDarkMode)

  return (
    <BrowserRouter>
      <MantineProvider
        theme={{
          ...RefineThemes.Green,
          colorScheme: darkMode,
          }}
        withNormalizeCSS
        withGlobalStyles
      >
        <Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />
        <NotificationsProvider position="bottom-right">
          <Refine
            // dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            dataProvider={keygenshDataProvider}
            authProvider={authProvider}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "products",
                list: "/products",
                show: "/products/show/:id",
                edit: "/products/edit/:id",
                create: "/products/create",
              },
              {
                name: "policies",
                list: "/policies",
                show: "/policies/show/:id",
                edit: "/policies/edit/:id",
                create: "/policies/create",
              },
              {
                name: "licenses",
                list: "/licenses",
                show: "/licenses/show/:id",
                edit: "/licenses/edit/:id",
                create: "/licenses/create",
              },
              {
                name: "entitlements",
                list: "/entitlements",
                show: "/entitlements/show/:id",
                edit: "/entitlements/edit/:id",
                create: "/entitlements/create",
              },
              {
                name: "machines",
                list: "/machines",
                show: "/machines/show/:id",
                edit: "/machines/edit/:id",
                create: "/machines/create",
              },
              {
                name: "processes",
                list: "/processes",
                show: "/processes/show/:id",
                edit: "/processes/edit/:id",
                create: "/processes/create",
              },
              {
                name: "components",
                list: "/components",
                show: "/components/show/:id",
                edit: "/components/edit/:id",
                create: "/components/create",
              },
              {
                name: "tokens",
                list: "/tokens",
                show: "/tokens/show/:id",
                edit: "/tokens/edit/:id",
                create: "/tokens/create",
              },
              {
                name: "webhook-endpoints",
                list: "/webhook-endpoints",
                show: "/webhook-endpoints/show/:id",
                edit: "/webhook-endpoints/edit/:id",
                create: "/webhook-endpoints/create",
              },
              {
                name: "users",
                list: "/users",
                show: "/users/show/:id",
                edit: "/users/edit/:id",
                create: "/users/create",
              },
            ]}
            options={{
              syncWithLocation: true,
              disableTelemetry: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <ColorSchemeProvider colorScheme={darkMode} toggleColorScheme={toggleDarkMode}>
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                    v3LegacyAuthProviderCompatible={false}
                  >
                    {/* come on people... cha ching me people, cha ching me*/}
                      <ThemedLayoutV2
                        Title={({ collapsed }) => (
                          <ThemedTitleV2
                            // collapsed is a boolean value that indicates whether the <Sidebar> is collapsed or not
                            collapsed={collapsed}
                            icon={collapsed ? <IconKey /> : <IconKey />}
                            text={siteConstants.appName}
                          />
                        )}
                        Header={Header}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                  </Authenticated>
                  </ColorSchemeProvider>
                }
              >
                <Route index element={<NavigateToResource resource="products" />} />

                <Route path={`/${siteConstants.resources.products}`}>
                  <Route index element={<ProductList />} />
                  <Route path="create" element={<ProductCreate />} />
                  <Route path="edit/:id" element={<ProductEdit />} />
                  <Route path="show/:id" element={<ProductShow />} />
                </Route>
                <Route path={`/${siteConstants.resources.policies}`}>
                  <Route index element={<PolicyList />} />
                  <Route path="create" element={<PolicyCreate />} />
                  <Route path="edit/:id" element={<PolicyEdit />} />
                  <Route path="show/:id" element={<PolicyShow />} />
                </Route>
                <Route path={`/${siteConstants.resources.licenses}`}>
                  <Route index element={<LicenseList />} />
                  <Route path="create" element={<LicenseCreate />} />
                  <Route path="edit/:id" element={<LicenseEdit />} />
                  <Route path="show/:id" element={<LicenseShow />} />
                </Route>
                  <Route path={`/${siteConstants.resources.entitlements}`}>
                  <Route index element={<EntitlementList />} />
                  <Route path="create" element={<EntitlementCreate />} />
                  <Route path="edit/:id" element={<EntitlementEdit />} />
                  <Route path="show/:id" element={<EntitlementShow />} />
                </Route>
                  <Route path={`/${siteConstants.resources.machines}`}>
                  <Route index element={<MachineList />} />
                  <Route path="create" element={<MachineCreate />} />
                  <Route path="edit/:id" element={<MachineEdit />} />
                  <Route path="show/:id" element={<MachineShow />} />
                </Route>
                  <Route path={`/${siteConstants.resources.processes}`}>
                  <Route index element={<ProcessList />} />
                  <Route path="create" element={<ProcessCreate />} />
                  <Route path="edit/:id" element={<ProcessEdit />} />
                  <Route path="show/:id" element={<ProcessShow />} />
                </Route>
                  <Route path={`/${siteConstants.resources.components}`}>
                  <Route index element={<ComponentList />} />
                  <Route path="create" element={<ComponentCreate />} />
                  <Route path="edit/:id" element={<ComponentEdit />} />
                  <Route path="show/:id" element={<ComponentShow />} />
                </Route>
                  <Route path={`/${siteConstants.resources["webhook-endpoints"]}`}>
                  <Route index element={<WebhookList />} />
                  <Route path="create" element={<WebhookCreate />} />
                  <Route path="edit/:id" element={<WebhookEdit />} />
                  <Route path="show/:id" element={<WebhookShow />} />
                </Route>
                  <Route path={`/${siteConstants.resources.tokens}`}>
                  <Route index element={<TokenList />} />
                  <Route path="create" element={<TokenCreate />} />
                  <Route path="edit/:id" element={<TokenEdit />} />
                  <Route path="show/:id" element={<TokenShow />} />
                </Route>
                <Route path={`/${siteConstants.resources.users}`}>
                  <Route index element={<UserList />} />
                  <Route path="create" element={<UserCreate />} />
                  <Route path="edit/:id" element={<UserEdit />} />
                  <Route path="show/:id" element={<UserShow />} />
                </Route>
              </Route>

              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="products" />
                  </Authenticated>
                }
              >
                  <Route path="/login" element={ <Login /> } />
              </Route>

              <Route
                element={
                  <Authenticated key="catch-all">
                      <ThemedLayoutV2
                          Header={Header}
                          Title={({ collapsed }) => (
                              <ThemedTitleV2
                                  // collapsed is a boolean value that indicates whether the <Sidebar> is collapsed or not
                                  collapsed={collapsed}
                                  icon={collapsed ? <IconKey /> : <IconKey />}
                                  text={siteConstants.appName}
                              />
                          )}
                      >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </NotificationsProvider>
      </MantineProvider>
    </BrowserRouter>
  );
};

// function Header() {
//   const darkMode = useAppStateStore(state => state.darkMode)
//   const toggleDarkMode = useAppStateStore(state => state.toggleDarkMode)
//   return (
//       <>
//         <MantineHeader height={50} p="xs">
//           <Group position="right">
//             <ActionIcon
//                 variant="outline"
//                 color={darkMode === "dark" ? "yellow" : "primary"}
//                 onClick={() => toggleDarkMode()}
//                 title="Toggle color scheme"
//             >
//               {darkMode === "dark" ? <IconSun /> : <IconMoonStars />}
//             </ActionIcon>
//           </Group>
//         </MantineHeader>
//       </>
//       )
// }

export default App;
