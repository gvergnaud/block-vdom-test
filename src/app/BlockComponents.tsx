"use client";

import React from "react";
import { block, BlockProps } from "./block";
import { RenderBlock } from "./block-react";

export const Greeting = ({ name }: { name: string }) => {
  return (
    <RenderBlock>
      {BlockComponent({
        name: NameSpan({ firstName: name }),
        child: HaskellCurryWikipediaPage({ name: name + "!!!!!" }),
      })}
    </RenderBlock>
  );
};

const BlockComponent = block(
  ({ name, child }: BlockProps<"name" | "child">) => {
    return (
      <div className="p-5">
        <div className="flex">
          <div className="flex">
            <p>My name is {name}!</p>
          </div>
        </div>
        <div>{child}</div>
      </div>
    );
  }
);

const NameSpan = block(({ firstName }: { firstName: string }) => {
  return <span className="text-red-600">!!{firstName}!!</span>;
});

const HaskellCurryWikipediaPage = block(({ name }) => {
  return (
    <table className="infobox biography vcard">
      <tbody>
        <tr>
          <th className="infobox-above">
            <div className="fn" style={{ display: "inline" }}>
              {name}
            </div>
          </th>
        </tr>
        <tr>
          <th scope="row" className="infobox-label">
            Born
          </th>
          <td className="infobox-data">
            <span style={{ display: "none" }}>
              (<span className="bday">1900-09-12</span>)
            </span>
            September 12, 1900
            <br />
            <div style={{ display: "inline" }} className="birthplace">
              <a
                href="/wiki/Millis,_Massachusetts"
                title="Millis, Massachusetts"
              >
                Millis, Massachusetts
              </a>
              , US
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row" className="infobox-label">
            Died
          </th>
          <td className="infobox-data">
            September 1, 1982
            <span>(1982-09-01)</span> (aged&nbsp;81)
            <br />
            <div className="deathplace">
              <a
                href="/wiki/State_College,_Pennsylvania"
                title="State College, Pennsylvania"
              >
                State College, Pennsylvania
              </a>
              , US
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row" className="infobox-label">
            Nationality
          </th>
          <td className="infobox-data category">American</td>
        </tr>
        <tr>
          <th scope="row" className="infobox-label">
            Alma&nbsp;mater
          </th>
          <td className="infobox-data">
            <div className="plainlist">
              <ul>
                <li>
                  <a href="/wiki/Harvard_University" title="Harvard University">
                    Harvard University
                  </a>
                </li>
                <li>
                  <a
                    href="/wiki/University_of_G%C3%B6ttingen"
                    title="University of Göttingen"
                  >
                    University of Göttingen
                  </a>
                </li>
              </ul>
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row" className="infobox-label">
            Known&nbsp;for
          </th>
          <td className="infobox-data">
            <a href="/wiki/Combinatory_logic" title="Combinatory logic">
              Combinatory logic
            </a>
            <br />
            <a
              href="/wiki/Curry%E2%80%93Howard_correspondence"
              title="Curry–Howard correspondence"
            >
              Curry–Howard correspondence
            </a>
            <br />
            <a href="/wiki/Curry%27s_paradox" title="Curry's paradox">
              {"Curry's"} paradox
            </a>
            <br />
            <a
              href="/wiki/Formalism_in_the_philosophy_of_mathematics"
              className="mw-redirect"
              title="Formalism in the philosophy of mathematics"
            >
              Formalism in the philosophy of mathematics
            </a>
          </td>
        </tr>
        <tr>
          <td className="infobox-full-data">
            <link
              rel="mw-deduplicated-inline-style"
              href="mw-data:TemplateStyles:r1066479718"
            />
            <b>Scientific career</b>
          </td>
        </tr>
        <tr>
          <th scope="row" className="infobox-label">
            Fields
          </th>
          <td className="infobox-data category">
            <a href="/wiki/Mathematics" title="Mathematics">
              Mathematics
            </a>
            <br />
            <a href="/wiki/Logic" title="Logic">
              Logic
            </a>
          </td>
        </tr>
        <tr>
          <th scope="row" className="infobox-label">
            Institutions
          </th>
          <td className="infobox-data">
            <a
              href="/wiki/Pennsylvania_State_University"
              title="Pennsylvania State University"
            >
              Pennsylvania State University
            </a>
            <br />
            <a
              href="/wiki/University_of_Amsterdam"
              title="University of Amsterdam"
            >
              University of Amsterdam
            </a>
          </td>
        </tr>
        <tr>
          <th scope="row" className="infobox-label">
            <a href="/wiki/Doctoral_advisor" title="Doctoral advisor">
              Doctoral advisor
            </a>
          </th>
          <td className="infobox-data">
            <a href="/wiki/David_Hilbert" title="David Hilbert">
              David Hilbert
            </a>
          </td>
        </tr>
        <tr>
          <th scope="row" className="infobox-label">
            Influences
          </th>
          <td className="infobox-data">
            <a
              href="/wiki/Alfred_North_Whitehead"
              title="Alfred North Whitehead"
            >
              Alfred North Whitehead
            </a>
            <br />
            <a href="/wiki/Bertrand_Russell" title="Bertrand Russell">
              Bertrand Russell
            </a>
            <br />
            <a href="/wiki/Moses_Sch%C3%B6nfinkel" title="Moses Schönfinkel">
              Moses Schönfinkel
            </a>
          </td>
        </tr>
        <tr>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
});
