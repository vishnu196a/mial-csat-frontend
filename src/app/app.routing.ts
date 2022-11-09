import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
