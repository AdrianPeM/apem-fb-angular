import { Injectable } from '@angular/core';
import { deleteObject, getDownloadURL, ref, Storage, uploadBytesResumable, UploadTaskSnapshot } from '@angular/fire/storage';
import { AlertService } from './alert.service';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage, private spinnerService: SpinnerService, private alertService: AlertService) { }

  uploadFile(
    file: File,
    updateCb: (snapshot: UploadTaskSnapshot) => void = () => false,
    pathName: string = ''
  ): Promise<string> {
    const path = `images/${pathName}${file.name}`
    const storageRef = ref(this.storage, path)
    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise((resolve, reject) => {
      return uploadTask.on(
        "state_changed",
        updateCb,
        () => reject(null),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve)
        }
      )
    })
  }

  async deleteFile(pathName: string): Promise<void> {
    if (!pathName) return
    this.spinnerService.startLoading()
    try {
      const desertRef = ref(this.storage, `images/${pathName}`);
      await deleteObject(desertRef)
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }

    this.spinnerService.stopLoading()
  }

  getPreview(file: File): Promise<string | ArrayBuffer | null> {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    return new Promise((resolve, reject) => {
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
    })
  }

}
