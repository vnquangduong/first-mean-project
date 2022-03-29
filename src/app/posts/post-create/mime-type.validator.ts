import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";

export const mimeType = (control: AbstractControl)
  : Observable<{ [key: string]: any } | null> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  const fileReaderObservable =  new Observable((observer: Observer<{[key: string]: any} | null>) => {
    fileReader.addEventListener('loadend', () => {
      if (fileReader.result) {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4)
        let header = ''
        let isValid = false
        for (let index = 0; index < arr.length; index++) {
          header += arr[index].toString(16)
        }
        switch (header) {
          case "89504e47":
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      } else {
        console.log('fileReader is null');
      }
    })
    fileReader.readAsArrayBuffer(file);
  })
  return fileReaderObservable;
}
