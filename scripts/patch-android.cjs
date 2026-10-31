const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'android');
const javaDir = path.join(root, 'app/src/main/java/tr/yzasistani/chat');
fs.mkdirSync(javaDir, { recursive: true });

const activity = `package tr.yzasistani.chat;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  private static final int FILE_CHOOSER_REQUEST = 4101;
  private ValueCallback<Uri[]> fileCallback;

  @Override public void onCreate(Bundle state) {
    super.onCreate(state);
    getBridge().getWebView().setWebChromeClient(new WebChromeClient() {
      @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
        fileCallback = callback;
        Intent files = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        files.addCategory(Intent.CATEGORY_OPENABLE);
        files.setType("*/*");
        files.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false);

        Intent camera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        Intent chooser = Intent.createChooser(files, "Dosya veya kamera seçin");
        chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[] { camera });
        startActivityForResult(chooser, FILE_CHOOSER_REQUEST);
        return true;
      }
    });
  }

  @Override protected void onActivityResult(int request, int result, Intent data) {
    if (request == FILE_CHOOSER_REQUEST && fileCallback != null) {
      Uri[] resultUris = null;
      if (result == Activity.RESULT_OK && data != null) {
        Uri uri = data.getData();
        if (uri != null) resultUris = new Uri[] { uri };
      }
      fileCallback.onReceiveValue(resultUris);
      fileCallback = null;
      return;
    }
    super.onActivityResult(request, result, data);
  }
}
`;
fs.writeFileSync(path.join(javaDir, 'MainActivity.java'), activity);

const manifestPath = path.join(root, 'app/src/main/AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  if (!manifest.includes('android.permission.CAMERA')) {
    manifest = manifest.replace('>', '>\n    <uses-permission android:name="android.permission.CAMERA" />', 1);
    fs.writeFileSync(manifestPath, manifest);
  }
}
