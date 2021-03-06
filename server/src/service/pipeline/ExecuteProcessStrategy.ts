import { IExecuteStrategy } from "@open-sourcerers/j-stillery";
import * as Process from "child_process";
import PipelinePayloadModel from "../../model/PipelinePayloadModel";
import ILogger from "../logger/ILogger";
import NullLogger from "../logger/NullLogger";
import PhpmdService from "../PhpmdService";

class ExecuteProcessStrategy implements IExecuteStrategy<PipelinePayloadModel> {
    private service: PhpmdService;

    public constructor(
        private command: string,
        private rules: string,
        private logger: ILogger = new NullLogger()
    ) { }

    public execute(
        input: PipelinePayloadModel,
        resolve: (output?: PipelinePayloadModel | PromiseLike<PipelinePayloadModel>) => void,
        reject: (reason: any) => void
    ) {
        this.executeProcess(input.path).then((data) => {
            input.raw = data;

            resolve(input);
        }, (err: Error) => {
            reject(err);
        });
    };

    public setService(service: PhpmdService) {
        this.service = service;
    }

    protected getService() {
        if (!this.service) {
            this.service = new PhpmdService(this.command);
            this.service.setLogger(this.logger);
        }

        return this.service;
    }

    protected executeProcess(path: string): Promise<string> {
        return this.getService().run(path + " xml " + this.rules);
    }
}

export default ExecuteProcessStrategy;
