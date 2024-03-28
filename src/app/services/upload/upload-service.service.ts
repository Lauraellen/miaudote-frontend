import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize, map, switchMap } from 'rxjs';
import { FileUpload } from 'src/app/models/model-upload';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {

  private basePath = '/uploads';

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) { }
  
//   pushFileToStorage(fileUpload: FileUpload): Observable<{url: string, name: string }> {
//     const filePath = `${this.basePath}/${fileUpload.file.name}`;
//     const storageRef = this.storage.ref(filePath);
//     const uploadTask = this.storage.upload(filePath, fileUpload.file);
    
//      // Retorna um Observable combinando o progresso e a URL do download
//      return uploadTask.snapshotChanges().pipe(
//         switchMap(() => {
//           // Assim que o upload estiver completo, obtenha a URL de download e retorne junto com o progresso e o nome do arquivo
//           return storageRef.getDownloadURL().pipe(
//             map((downloadURL: string) => {
//               return {
//                 url: downloadURL,
//                 name: fileUpload.file.name
//               };
//             })
//           );
//         })
//       );
//   }
// pushFileToStorage(fileUpload: FileUpload): { percentageChanges: Observable<number | undefined>, url: string, alt: string } {
//     const filePath = `${this.basePath}/${fileUpload.file.name}`;
//     const storageRef = this.storage.ref(filePath);
//     const uploadTask = this.storage.upload(filePath, fileUpload.file);

//     uploadTask.snapshotChanges().pipe(
//         finalize(() => {
//             storageRef.getDownloadURL().subscribe((downloadURL: any) => {
//                 fileUpload.url = downloadURL;
//                 fileUpload.name = fileUpload.file.name;
//                 this.saveFileData(fileUpload);
//             });
//         })
//     ).subscribe();

//     // Retorna um objeto contendo o Observable de mudanças de porcentagem e o objeto fileUpload
//     return { percentageChanges: uploadTask.percentageChanges(), url: fileUpload.url, alt: fileUpload.file.name };
// }

pushFileToStorage(fileUpload: FileUpload): Observable<number | undefined> {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    return uploadTask.snapshotChanges().pipe(
        finalize(() => {
            storageRef.getDownloadURL().subscribe((downloadURL: any) => {
                fileUpload.url = downloadURL;
                fileUpload.name = fileUpload.file.name;
                this.saveFileData(fileUpload);
            });
        }),
        switchMap(() => uploadTask.percentageChanges())
    );
}




  private saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.basePath).push(fileUpload);
  }

  getFiles(numberItems: number): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, (ref: any) =>
      ref.limitToLast(numberItems));
  }

  getAllFiles(fileName: string): AngularFireList<FileUpload> {
    return this.db.list(`${this.basePath}/${fileName}`, (ref: any) =>
      ref);
  }

  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
}