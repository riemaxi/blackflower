package com.example.wilcoiner

import android.content.Context
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.runtime.Composable
import androidx.compose.ui.viewinterop.AndroidView

@Composable
fun BlackView(context: Context, url: String) {

    AndroidView(factory = {
        WebView(context).apply {
            webViewClient = WebViewClient()

            loadUrl(url)
        }
    })
}