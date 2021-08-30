import { LinuxBuildImage, PipelineProject } from "@aws-cdk/aws-codebuild";
import { Construct } from "@aws-cdk/core";

export class LambdaCodeDeployProjects extends Construct {
  public lambdaDeployProject: PipelineProject;
  constructor(scope: Construct, id: string, props: {}) {
    super(scope, id);

    this.lambdaDeployProject = new PipelineProject(
      this,
      "LambdaDeployProject",
      {
        environment: { buildImage: LinuxBuildImage.STANDARD_5_0 },
      }
    );
  }
}
