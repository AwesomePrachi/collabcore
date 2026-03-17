import express from "express";
import cors from "cors";
import documentRoutes from "./modules/document/document.routes.js";
import activityRoutes from "./modules/activity/activity.routes.js"
import versionRoutes from "./modules/version/version.routes.js"
import aiRoutes from "./modules/ai/ai.routes.js"
import commentRoutes from "./modules/comment/comment.routes.js"
import userRoutes from "./modules/user/user.routes.js"

export const createApp = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get("/health", (_, res) => {
        res.json({ status: "CollabCore API running 🚀" });
    });

    app.use("/api/auth", userRoutes);
    app.use("/api/documents", documentRoutes);
    app.use("/api/activity", activityRoutes);
    app.use("/api/versions", versionRoutes);
    app.use("/api/ai", aiRoutes);
    app.use("/api/comments", commentRoutes);

    return app;
};