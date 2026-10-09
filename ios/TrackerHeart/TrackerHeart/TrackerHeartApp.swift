//
//  TrackerHeartApp.swift
//  TrackerHeart
//
//  Created by Bradley Staples on 10/9/26.
//

import SwiftUI
import FirebaseCore

@main
struct TrackerHeartApp: App {
    init() {
        FirebaseApp.configure()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
