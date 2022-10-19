import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers

import { P404Component } from '@public/error/404.component';
import { SsoComponent } from '@public/sso/sso.component';
import { DefaultLayoutComponent } from '@shared/containers/default-layout/default-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'live_call',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('@public/authentication/authentication.module').then(
        (module) => module.AuthenticationModule
      ),
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    loadChildren: () => import('@secure/secure.module').then((module) => module.SecureModule),
  },
  {
    path: 'authorize',
    component: SsoComponent,
  },
  { path: '**', component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
