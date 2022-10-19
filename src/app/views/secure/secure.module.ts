import { SecureRoutingModule } from './secure-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, SecureRoutingModule, SharedModule, FormsModule],
  declarations: [],
})
export class SecureModule {}
