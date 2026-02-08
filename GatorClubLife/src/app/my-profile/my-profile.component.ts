import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserInfo } from '../auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class MyProfileComponent implements OnInit {
  user: UserInfo | null = null;
  editablePhone: string = '';
  isEditing: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUserDetails();
    if (this.user) {
      this.editablePhone = this.user.phone || '';
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.editablePhone = this.user.phone || '';
    }
  }

  saveChanges(): void {
    if (this.user) {
      this.user.phone = this.editablePhone;
      this.authService.setUser(this.user);
    }
    this.isEditing = false;
  }
}
