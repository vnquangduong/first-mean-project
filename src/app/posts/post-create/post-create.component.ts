import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NG_ASYNC_VALIDATORS, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";

import { PostsService } from "../posts.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  selectedPost: Post = { id: '', title: '', content: ''};
  isLoading = false;
  form!: FormGroup;
  imagePreview: string = '';

  private mode = 'create';
  private selectedPostId: string = '';

  constructor (public postsService: PostsService, public route: ActivatedRoute) {} //inject

  ngOnInit() {

    this.form = new FormGroup({
      'title': new FormControl(null, { validators:
        [ Validators.required, Validators.minLength(3) ] }),
      'content': new FormControl(null, { validators:
        [ Validators.required ] }),
      'image': new FormControl(null, {
        validators: [ Validators.required ],
        asyncValidators: [ mimeType ] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          const id = paramMap.get('postId');
          if (id) {
            this.isLoading = true;
            this.mode = 'edit';
            this.selectedPostId = id;
            this.postsService.getPost(this.selectedPostId)
              .subscribe(postData => {
                this.isLoading = false;
                this.selectedPost = {
                  id: postData._id, title : postData.title, content: postData.content
                };
                this.form.setValue({
                  'title': this.selectedPost.title,
                  'content': this.selectedPost.content,
                })
              })
          } else {
            console.log(id);
          }
        } else {
          this.mode = 'create';
          this.selectedPostId = '';
        }
      });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content
      );
    } else {
      this.postsService.updatePost(
        this.selectedPostId,
        this.form.value.title,
        this.form.value.content
      )
    }

    this.form.reset();
  }

  onImageSelect(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (!files) {
      console.log('HTML file input not found');
      return;
    } else {
      const file = files[0];
      this.form.patchValue({ 'image': file });
      this.form.get('image')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imagePreview = reader.result.toString();
        } else {
          console.log('Result of reader is null!');
          return;
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
